# ADR 014: Adoption of Retrieval-Augmented Generation (RAG)

## Status
Approved

## Context
Shadow Engineer must answer complex architectural questions and perform accurate code reviews based on the specific, proprietary context of a user's repository.

## Problem Statement
Foundational LLMs (like GPT-4o or Claude 3.5) are trained on public data. They hallucinate or provide generic answers when asked about private, proprietary codebases they have never seen.

## Decision
We will implement Retrieval-Augmented Generation (RAG) to dynamically inject relevant repository context into the LLM prompt at runtime.

## Alternatives Considered
*   **Fine-Tuning:** Extremely expensive, slow, and requires retraining every time a developer pushes a new commit. Unfeasible for real-time codebase understanding.
*   **Massive Context Windows:** Passing the entire 1M+ line repository into the prompt for every query is prohibitively expensive, slow, and causes "lost in the middle" degradation in LLM reasoning.

## Pros
*   Real-time accuracy: The LLM always has the latest code context based on the most recent commits.
*   Cost-effective: Only relevant snippets (chunks) are passed to the LLM, saving token costs.
*   Prevents hallucinations by strictly grounding the LLM in retrieved facts.

## Cons
*   Search accuracy dictates answer quality; if the vector database retrieves the wrong code chunks, the LLM will fail.
*   Requires complex chunking strategies (e.g., splitting by Abstract Syntax Tree boundaries rather than arbitrary character limits).

## Trade-offs
We trade the conceptual simplicity of basic prompting for a complex data pipeline (chunking, embedding, vector search) to guarantee high accuracy and lower token costs.

## Consequences
*   We must develop intelligent, AST-aware chunking algorithms in Python to ensure code functions are not split in half during vectorization.
*   We must implement Hybrid Search (Vector Similarity + BM25 Keyword Search) to maximize retrieval precision.

## Future Considerations
We will evolve basic RAG into Graph-RAG by integrating Neo4j, allowing the system to follow function call chains and imports across multiple files before constructing the final prompt.
