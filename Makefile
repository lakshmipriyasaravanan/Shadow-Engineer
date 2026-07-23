.PHONY: help build run stop logs test clean

# Help Menu
help:
	@echo "Shadow Engineer - Developer Toolkit"
	@echo "---------------------------------"
	@echo "make run        - Start all local services via Docker Compose"
	@echo "make stop       - Stop all local services"
	@echo "make logs       - Tail logs for all services"
	@echo "make build      - Build all Docker images locally"
	@echo "make test       - Run all unit and integration tests"
	@echo "make clean      - Remove built artifacts and clean workspace"
	@echo "make dev-web    - Run Next.js frontend in dev mode"
	@echo "make dev-core   - Run Spring Boot core service in dev mode"
	@echo "make dev-ai     - Run Python AI service in dev mode"

# Infrastructure Commands
run:
	docker-compose up -d

stop:
	docker-compose down

logs:
	docker-compose logs -f

build:
	docker build -t shadow-engineer/core-service:latest apps/core-service
	docker build -t shadow-engineer/ai-service:latest apps/ai-service
	docker build -t shadow-engineer/web:latest apps/web

test:
	cd apps/core-service && ./mvnw test
	cd apps/ai-service && poetry run pytest
	cd apps/web && npm run test

clean:
	cd apps/core-service && ./mvnw clean
	cd apps/web && rm -rf .next node_modules
	find . -type d -name "__pycache__" -exec rm -rf {} +

# Local Dev Commands
dev-web:
	cd apps/web && npm run dev

dev-core:
	cd apps/core-service && ./mvnw spring-boot:run

dev-ai:
	cd apps/ai-service && poetry run uvicorn ai_service.main:app --reload
