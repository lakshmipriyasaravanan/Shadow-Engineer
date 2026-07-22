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
