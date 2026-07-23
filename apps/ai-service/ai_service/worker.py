import os
import structlog
from redis import Redis
from rq import Queue
from ai_service.chunker import RepositoryChunker
from ai_service.embeddings import EmbeddingService
from ai_service.qdrant_client_mgr import QdrantManager
from qdrant_client.http.models import PointStruct
import uuid

logger = structlog.get_logger()

redis_conn = Redis(
    host=os.getenv("REDIS_HOST", "localhost"), 
    port=int(os.getenv("REDIS_PORT", "6379"))
)
job_queue = Queue('repository_indexing', connection=redis_conn)

def index_repository_task(repo_path: str, repository_id: str, branch: str = "main"):
    """Background task to chunk, embed, and store repository in Qdrant."""
    logger.info("Starting background indexing job", repository_id=repository_id)
    
    chunker = RepositoryChunker()
    embedding_service = EmbeddingService()
    qdrant_manager = QdrantManager()
    client = qdrant_manager.get_client()
    
    try:
        all_chunks = []
        for root, _, files in os.walk(repo_path):
            if any(part in root.split(os.sep) for part in ['.git', 'node_modules', 'target']):
                continue
                
            for file in files:
                file_path = os.path.join(root, file)
                if file.startswith('.') or file.endswith(('.pyc', '.class', '.png', '.jpg')):
                    continue
                    
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    chunks = chunker.chunk_file(file_path, content, repository_id, branch)
                    all_chunks.extend(chunks)
                except UnicodeDecodeError:
                    pass # skip binaries

        logger.info(f"Generated {len(all_chunks)} chunks for {repository_id}")
        
        # Batch Embed & Upsert
        BATCH_SIZE = 100
        for i in range(0, len(all_chunks), BATCH_SIZE):
            batch = all_chunks[i:i + BATCH_SIZE]
            texts = [c["text"] for c in batch]
            
            embeddings = embedding_service.generate_embeddings_batch(texts)
            
            points = []
            for j, chunk in enumerate(batch):
                points.append(PointStruct(
                    id=str(uuid.uuid4()),
                    vector=embeddings[j],
                    payload={**chunk["metadata"], "text": chunk["text"]}
                ))
                
            client.upsert(
                collection_name=QdrantManager.COLLECTION_NAME,
                points=points
            )
            
        logger.info("Indexing completed successfully", repository_id=repository_id)
        return {"status": "success", "chunks_indexed": len(all_chunks)}
        
    except Exception as e:
        logger.error("Indexing failed", error=str(e), repository_id=repository_id)
        raise e

def analyze_pr_task(repository_id: str, pull_request_id: str, github_pr_id: int):
    """Background task to analyze a PR diff and generate an AI review."""
    logger.info("Starting PR Review Analysis", pr_id=pull_request_id)
    import json
    from ai_service.prompts import PromptTemplates
    
    try:
        # 1. Fetch Diff from GitHub (Mocking for now to avoid token complexites in background)
        diff = "diff --git a/src/main/java/com/shadowengineer/core/service/AuthService.java b/src/main/java/com/shadowengineer/core/service/AuthService.java\n+ String query = \"SELECT * FROM users WHERE email = '\" + email + \"'\";"
        
        # 2. Build Prompt
        prompt = PromptTemplates.build_pr_review_prompt(diff)
        
        # 3. In a real scenario, we'd call the LLM Gateway here.
        # For the prototype, we simulate the structured JSON response
        mock_ai_response = {
            "executiveSummary": "This PR introduces a critical SQL injection vulnerability in AuthService.",
            "securityScore": 20,
            "maintainabilityScore": 85,
            "performanceScore": 90,
            "comments": [
                {
                    "filePath": "src/main/java/com/shadowengineer/core/service/AuthService.java",
                    "severity": "CRITICAL",
                    "reason": "Direct string concatenation in SQL queries leads to SQL Injection (OWASP Top 1).",
                    "suggestion": "Use PreparedStatements or JPA parameter binding instead."
                }
            ]
        }
        
        # 4. Notify Spring Boot backend that the review is complete
        import requests
        requests.post(
            f"http://localhost:8080/api/v1/repositories/{repository_id}/prs/{pull_request_id}/review/complete",
            json=mock_ai_response
        )
        
        logger.info("PR Review completed successfully", pr_id=pull_request_id)
        return {"status": "success", "pr_id": pull_request_id}
        
    except Exception as e:
        logger.error("PR Review failed", error=str(e), pr_id=pull_request_id)
        raise e

def generate_artifact_task(repository_id: str, artifact_id: str, artifact_type: str, title: str):
    """Background task to generate documentation, tests, or diagrams."""
    logger.info("Starting Artifact Generation", artifact_id=artifact_id, type=artifact_type)
    from ai_service.prompts import PromptTemplates
    import requests
    
    try:
        # 1. Fetch Repository Context (Mocked for prototype)
        context = "class AuthService { public void login(String username, String password) { // implementation } }"
        
        # 2. Build Prompt & Simulate LLM Call
        if artifact_type == 'TEST':
            prompt = PromptTemplates.build_generate_tests_prompt(context, "JUnit 5")
            mock_content = "```java\n@Test\nvoid testLogin() {\n  authService.login(\"user\", \"pass\");\n}\n```"
        elif artifact_type == 'DIAGRAM':
            prompt = PromptTemplates.build_generate_docs_prompt(context, artifact_type)
            mock_content = "```mermaid\nclassDiagram\n  class AuthService {\n    +login(username, password)\n  }\n```"
        else:
            prompt = PromptTemplates.build_generate_docs_prompt(context, artifact_type)
            mock_content = "# Authentication Service Documentation\nThis service handles user logins."
        
        # 3. Notify Spring Boot backend that generation is complete
        requests.post(
            f"http://localhost:8080/api/v1/repositories/{repository_id}/artifacts/{artifact_id}/complete",
            json={"content": mock_content, "status": "COMPLETED"}
        )
        
        logger.info("Artifact generation completed", artifact_id=artifact_id)
        return {"status": "success", "artifact_id": artifact_id}
        
    except Exception as e:
        logger.error("Artifact generation failed", error=str(e), artifact_id=artifact_id)
        # Notify failure
        requests.post(
            f"http://localhost:8080/api/v1/repositories/{repository_id}/artifacts/{artifact_id}/complete",
            json={"content": str(e), "status": "FAILED"}
        )
        raise e
