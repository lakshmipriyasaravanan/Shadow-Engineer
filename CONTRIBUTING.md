# Contributing to Shadow Engineer

First off, thank you for considering contributing to Shadow Engineer! 

## Development Process

1. **Fork the repository** and clone it locally.
2. **Copy `.env.example` to `.env`** and configure your keys.
3. **Run `make run`** to start the local Docker Compose stack.
4. **Create a branch** (`git checkout -b feature/amazing-feature`).
5. **Commit your changes** following Conventional Commits (`feat: ...`, `fix: ...`).
6. **Run tests** via `make test`.
7. **Push to your fork** and open a Pull Request against the `main` branch.

## Architecture Guidelines
- Ensure any Spring Boot logic adheres to Clean Architecture (Controllers -> Services -> Repositories).
- Ensure Python AI logic is cleanly separated (FastAPI routes -> LangChain/LLM logic).
- Never commit secrets or API keys.
