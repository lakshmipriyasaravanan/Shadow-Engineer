# Vector Database Guide

Shadow Engineer uses **Qdrant** as the primary vector database for the AI Knowledge Engine.

## Architecture

1. **Intelligent Chunking**: Source files are chunked dynamically based on their language using LangChain's `RecursiveCharacterTextSplitter`.
2. **Embeddings**: We use OpenAI's `text-embedding-3-small` (1536 dimensions) for dense vector representation.
3. **Storage (Qdrant)**:
   - Collection Name: `repository_knowledge`
   - Distance Metric: `Cosine`
   - Metadata filtering: We create payload indexes on `repository_id` and `file_path`. This ensures absolute multi-tenant isolation. No AI search can access vectors outside the queried repository.

## Starting Qdrant
Qdrant is configured to run inside the shared `docker-compose.yml`.
```bash
docker-compose up -d qdrant
```
Qdrant Dashboard is available at `http://localhost:6333/dashboard`.

## Asynchronous Indexing (RQ)
When a repository is imported, the `/api/v1/index` endpoint queues a background task in **Redis Queue (RQ)**.
The worker walks the codebase, chunks the text, bats embeddings via OpenAI, and upserts them into Qdrant.
Start the worker via:
```bash
cd apps/ai-service
poetry run rq worker repository_indexing
```
