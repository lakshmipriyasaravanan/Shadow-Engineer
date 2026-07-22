# Environment Variables Guide

This document outlines the required environment variables for the Shadow Engineer monorepo.

## Backend (`apps/core-service`)
Create a `.env` file in `apps/core-service`:
```
DB_URL=jdbc:postgresql://localhost:5432/shadow_engineer
DB_USER=postgres
DB_PASSWORD=password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## AI Service (`apps/ai-service`)
Create a `.env` file in `apps/ai-service`:
```
QDRANT_HOST=localhost
QDRANT_PORT=6333
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Frontend (`apps/web`)
Create a `.env.local` file in `apps/web`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```
