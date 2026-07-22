# AI Chat Guide

The Developer Copilot enables real-time conversations regarding indexed repositories.

## Architecture

1. **Storage (Spring Boot)**: Chat history is persisted in PostgreSQL using the `conversations` and `messages` tables via the Core Service.
2. **Memory & Context (FastAPI)**: To prevent context drift, the last 10 messages of a conversation are passed to the AI along with the RAG context fetched from Qdrant.
3. **Streaming (SSE)**: For maximum performance, the Next.js frontend circumvents the Spring Boot API Gateway for inference. It directly opens a Server-Sent Events (SSE) connection to `POST /api/v1/chat/stream` on the Python AI Service. Once the stream concludes, Next.js saves the final message to Spring Boot for durability.

## Prompt Specialization
The `PromptTemplates` class within `ai_service.prompts` orchestrates distinct prompts for:
- Repository Chat
- Code Review
- Documentation Generation

## UI Rendering
The Next.js client utilizes `react-markdown` to render the stream chunk-by-chunk. This ensures syntax highlighting and rich text format natively support GitHub Flavored Markdown (GFM).
