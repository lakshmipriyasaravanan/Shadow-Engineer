# Developer Productivity Guide

The Shadow Engineer platform serves as an autonomous developer productivity suite, providing robust capabilities to generate documentation, complex architecture diagrams, and testing scaffolds.

## Features

### 1. AI Documentation Generation
The Documentation Hub uses the underlying Repository Intelligence engine to generate exhaustive README files, Onboarding Guides, and Module documentation.
- **Trigger**: `POST /api/v1/generate/artifact`
- **Output**: Rendered dynamically using GitHub Flavored Markdown (GFM).

### 2. Architecture Diagram Engine
Instead of relying on static image generation, Shadow Engineer utilizes LLMs to generate precise `Mermaid.js` syntax.
- **Mermaid Viewer**: The Next.js frontend uses a custom React wrapper that renders the Mermaid SVG directly in the browser. This allows for dynamic resizing and dark mode support.
- **Capabilities**: System Architecture, ER Diagrams, Sequence Diagrams.

### 3. Test Scaffold Generation
Shadow Engineer acts as a pair-programmer, generating comprehensive test cases tailored to the language and framework of the selected code (e.g., JUnit 5 for Java, Pytest for Python).
- **Includes**: Boundary testing, edge cases, and mocking syntax.

## Technical Flow
1. User requests an artifact via Next.js UI.
2. A `PENDING` artifact record is created in PostgreSQL via Spring Boot.
3. Next.js dispatches a trigger to the FastAPI AI service.
4. The Redis background worker (`generate_artifact_task`) processes the LLM request.
5. The worker issues a webhook to Spring Boot (`/artifacts/{id}/complete`) to save the generated content.
6. The UI auto-refreshes and renders the artifact.
