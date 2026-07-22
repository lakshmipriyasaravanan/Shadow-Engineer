# ADR 006: Adoption of Python FastAPI for AI Services

## Status
Approved

## Context
Shadow Engineer requires parsing source code into ASTs, generating vector embeddings, interfacing with LLMs (OpenAI/Anthropic), and executing complex RAG chains.

## Problem Statement
While the core backend is Java, the Java AI ecosystem is nascent. We need a service layer capable of seamlessly utilizing state-of-the-art AI, ML, and data processing libraries.

## Decision
We will use Python with FastAPI to build the AI Service layer.

## Alternatives Considered
*   **Spring AI (Java):** Rapidly improving, but still lags behind Python in community support, native library integration (LangChain, LlamaIndex), and AST parsing utilities.
*   **Node.js:** Good async I/O, but lacks the deep mathematical and AI library ecosystem native to Python.

## Pros
*   Industry standard for AI/ML development.
*   FastAPI provides excellent performance (via Starlette), async support, and auto-generated OpenAPI documentation.
*   Direct access to LangChain, LlamaIndex, Tiktoken, and specialized AST parsing libraries (e.g., Tree-sitter).

## Cons
*   Introduces polyglot architecture (Java + Python), increasing operational complexity.
*   Python's GIL (Global Interpreter Lock) can bottleneck CPU-bound tasks if not managed via multi-processing.

## Trade-offs
We are trading the simplicity of a single-language repository for access to the most advanced and vibrant AI ecosystem available.

## Consequences
*   The CI/CD pipeline must build and deploy both Java and Python containers.
*   API contracts between Java and Python must be strictly enforced via OpenAPI specs.
*   CPU-bound tasks (AST parsing) in Python must use `asyncio` carefully or offload to process pools.

## Future Considerations
If performance bottlenecks occur in AST parsing, we may rewrite specific Python ingestor modules in Rust while keeping the API layer in FastAPI.
