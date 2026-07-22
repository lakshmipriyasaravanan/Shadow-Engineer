# Developer Setup Guide

Welcome to Shadow Engineer! Follow these steps to get your local environment running.

## Prerequisites
- Docker & Docker Compose
- Java 21
- Python 3.12
- Node.js 20

## 1. Local Infrastructure
```bash
docker-compose up -d
```
This starts PostgreSQL, Redis, and Qdrant.

## 2. Backend (Java)
```bash
cd apps/core-service
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## 3. AI Service (Python)
```bash
cd apps/ai-service
poetry install
poetry run uvicorn ai_service.main:app --reload
```

## 4. Frontend (Next.js)
```bash
cd apps/web
npm install
npm run dev
```

Platform is now running at `http://localhost:3000`.
