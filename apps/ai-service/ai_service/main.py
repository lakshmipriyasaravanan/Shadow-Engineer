import structlog
from fastapi import FastAPI
from pydantic import BaseModel

logger = structlog.get_logger()

app = FastAPI(
    title="Shadow Engineer AI Service",
    description="AST Parsing, Semantic Search, and RAG Engine",
    version="1.0.0",
)

class HealthResponse(BaseModel):
    status: str
    version: str

@app.get("/health", response_model=HealthResponse)
async def health_check():
    logger.info("Health check requested")
    return HealthResponse(status="ok", version="1.0.0")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ai_service.main:app", host="0.0.0.0", port=8000, reload=True)
