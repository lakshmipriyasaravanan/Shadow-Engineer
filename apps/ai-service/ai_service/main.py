import structlog
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from ai_service.scanner import analyze_repository
from ai_service.worker import job_queue, index_repository_task, analyze_pr_task
from ai_service.retriever import RetrieverService
from ai_service.llm_gateway import LLMGateway
from fastapi.responses import StreamingResponse
import os

logger = structlog.get_logger()

app = FastAPI(
    title="Shadow Engineer AI Service",
    description="AST Parsing, Semantic Search, and RAG Engine",
    version="1.0.0",
)

class HealthResponse(BaseModel):
    status: str
    version: str

class AnalysisRequest(BaseModel):
    repository_id: str

class SearchRequest(BaseModel):
    repository_id: str
    query: str
    limit: int = 5

class PRReviewRequest(BaseModel):
    repository_id: str
    pull_request_id: str
    github_pr_id: int

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    repository_id: str
    query: str
    history: list[Message] = []

@app.get("/health", response_model=HealthResponse)
async def health_check():
    logger.info("Health check requested")
    return HealthResponse(status="ok", version="1.0.0")

@app.post("/api/v1/analyze")
async def analyze_repo(request: AnalysisRequest):
    repo_path = f"/tmp/shadow-engineer/repos/{request.repository_id}"
    
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail="Repository path not found on disk")
        
    logger.info("Starting static analysis", repo_id=request.repository_id)
    
    try:
        metrics = analyze_repository(repo_path)
        logger.info("Analysis complete", metrics=metrics)
        return metrics
    except Exception as e:
        logger.error("Analysis failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/index")
async def trigger_indexing(request: AnalysisRequest):
    repo_path = f"/tmp/shadow-engineer/repos/{request.repository_id}"
    if not os.path.exists(repo_path):
        raise HTTPException(status_code=404, detail="Repository path not found on disk")
        
    job = job_queue.enqueue(index_repository_task, repo_path, request.repository_id)
    return {"job_id": job.id, "status": "queued"}

@app.post("/api/v1/review/trigger")
async def trigger_pr_review(request: PRReviewRequest):
    job = job_queue.enqueue(analyze_pr_task, request.repository_id, request.pull_request_id, request.github_pr_id)
    return {"job_id": job.id, "status": "queued"}

@app.post("/api/v1/search")
async def semantic_search(request: SearchRequest):
    try:
        retriever = RetrieverService()
        results = retriever.search(request.query, request.repository_id, request.limit)
        return {"results": results}
    except Exception as e:
        logger.error("Search failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/chat/stream")
async def chat_with_repo_stream(request: ChatRequest):
    try:
        retriever = RetrieverService()
        llm = LLMGateway()
        
        # Retrieve context
        context_chunks = retriever.search(request.query, request.repository_id, limit=5)
        
        # Format history
        history = [{"role": msg.role, "content": msg.content} for msg in request.history]
        
        # Stream response
        return StreamingResponse(
            llm.generate_response_stream(request.query, context_chunks, history),
            media_type="text/event-stream"
        )
    except Exception as e:
        logger.error("Chat failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ai_service.main:app", host="0.0.0.0", port=8000, reload=True)
