# Shadow Engineer

Your AI-powered software engineering teammate that deeply understands a software project and assists developers throughout the software development lifecycle.

## Overview

Unlike standard coding assistants, Shadow Engineer understands the entire project, architecture, documentation, pull requests, commit history, APIs, database schema, coding standards, and engineering decisions. It acts like a senior engineer who has worked on the project since day one.

## Monorepo Architecture

This repository is organized as a Turborepo-style monorepo:

- **`apps/web`**: Next.js 14 Frontend.
- **`apps/core-service`**: Spring Boot 3 Core Backend.
- **`apps/ai-service`**: FastAPI Python service for AST parsing and RAG.
- **`packages/`**: Shared libraries and utilities.
- **`docs/`**: Comprehensive project documentation (PRD, Architecture, DB, API, etc.).
- **`infrastructure/`**: IaC and Kubernetes deployments.
- **`docker/`**: `docker-compose.yml` and container configurations.

## Quickstart

To run the platform locally, refer to the [Local Development Guide](docs/08_Engineering/Local_Development.md).

```bash
docker-compose up -d
```

## Documentation

- [Product Requirements (PRD)](docs/01_Product/PRD.md)
- [Software Requirements (SRS)](docs/02_Requirements/SRS.md)
- [High-Level Design (HLD)](docs/03_Architecture/High_Level_Design.md)
- [Low-Level Design (LLD)](docs/03_Architecture/Low_Level_Design.md)
- [Database Design](docs/04_Database/Database_Design.md)
- [API Specification](docs/05_API/API_Specification.md)
- [Security Architecture](docs/06_Security/Security_Architecture.md)
- [AI Architecture](docs/06_AI/AI_Architecture.md)
- [UI/UX Design Specification](docs/07_UI_UX/UI_UX_Design.md)
- [Engineering Blueprint](docs/08_Engineering/Monorepo_Architecture.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
