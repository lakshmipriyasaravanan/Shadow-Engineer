# ADR 005: Adoption of Qdrant for Vector Database

## Status
Approved

## Context
Retrieval-Augmented Generation (RAG) is the core mechanism by which Shadow Engineer understands a codebase. We need to store millions of code chunks as high-dimensional vectors and retrieve them with sub-second latency.

## Problem Statement
We require a highly scalable Vector Database that supports metadata filtering (by repository, organization) and extremely fast similarity search (Cosine/Dot Product).

## Decision
We will use Qdrant as the primary Vector Database.

## Alternatives Considered
*   **Pinecone:** Fully managed and excellent, but closed-source and can become prohibitively expensive at scale. Prevents local, offline Docker development.
*   **Milvus:** Highly scalable, but operationally complex to deploy and manage for an early-stage startup.
*   **pgvector (PostgreSQL):** Great for small datasets, but performance degrades significantly when scaling to billions of dense vectors without dedicated hardware tuning.

## Pros
*   Written in Rust; highly performant and memory efficient.
*   Open-source; allows for local Docker-compose development environments without cloud dependencies.
*   Excellent support for payload filtering (crucial for tenant isolation).

## Cons
*   Newer ecosystem compared to Elasticsearch or Pinecone.
*   Managing a distributed Qdrant cluster in production requires Kubernetes expertise.

## Trade-offs
We trade the "zero-ops" convenience of Pinecone for the flexibility, cost-control, and local developer experience of Qdrant.

## Consequences
*   The DevOps team must manage Qdrant stateful sets in Kubernetes for production.
*   Vector dimensionality must be strictly aligned with the chosen embedding model (e.g., 1536 for OpenAI `text-embedding-3-small`).

## Future Considerations
If Qdrant management becomes an operational burden, we may migrate to Qdrant Cloud or evaluate specialized AWS vector offerings.
