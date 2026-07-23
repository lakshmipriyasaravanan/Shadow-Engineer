# Changelog

All notable changes to this project will be documented in this file.

## [v1.0.0] - 2026-07-23

### Added
- **Sprint 1**: Engineering Foundation (Spring Boot, Next.js, FastAPI skeletons).
- **Sprint 2**: Authentication & User Management (JWT, OAuth ready).
- **Sprint 3**: GitHub Integration & Repository Intelligence (AST parsing).
- **Sprint 4**: AI Knowledge Engine (Qdrant Vector DB integration).
- **Sprint 5**: AI Repository Chat & Developer Copilot UI.
- **Sprint 6**: AI Code Review Engine (Automated PR analysis & scoring).
- **Sprint 7**: AI Documentation & Test Generation (Mermaid SVG rendering).
- **Sprint 8**: Enterprise Analytics, Admin Portal, and Audit Logs.
- **Sprint 9**: Production Infrastructure (Docker, Terraform, Kubernetes, GitHub Actions).
- **Sprint 10**: Version 1.0 Polish, Makefiles, Documentation.

### Optimized
- Multi-stage Docker builds reducing container footprint.
- Next.js standalone build for production efficiency.

### Security
- Externalized all secrets to environment variables.
- Configured containers to run as non-root `shadowusr`.
- Implemented robust `audit_logs` tracking in PostgreSQL.
