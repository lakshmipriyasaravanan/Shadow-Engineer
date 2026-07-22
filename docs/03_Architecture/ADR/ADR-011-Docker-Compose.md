# ADR 011: Adoption of Docker Compose for Local Development

## Status
Approved

## Context
With a polyglot architecture (Java, Python, Node.js) and multiple databases (PostgreSQL, Redis, Qdrant), setting up a local development environment manually is error-prone and time-consuming.

## Problem Statement
We need a single-command solution to spin up the entire Shadow Engineer platform locally for developers, ensuring everyone operates on identical infrastructure configurations.

## Decision
We will use Docker Compose to orchestrate local development environments.

## Alternatives Considered
*   **Minikube / Local Kubernetes:** Replicates production perfectly, but is massive resource hog (high CPU/RAM) and overly complex for daily feature development.
*   **Manual Install Scripts:** Brittle, OS-dependent, and prone to environmental configuration drift.

## Pros
*   `docker-compose up -d` instantly provisions the entire stack.
*   Configuration is stored in source control (`docker-compose.yml`).
*   Extremely lightweight compared to local Kubernetes.

## Cons
*   Does not perfectly replicate production routing, scaling, or health-check logic native to Kubernetes.
*   Can obscure underlying infrastructure issues from developers.

## Trade-offs
We trade perfect production parity (Kubernetes) for an exceptionally fast, lightweight, and developer-friendly local environment.

## Consequences
*   We must maintain separate `docker-compose.yml` configurations for "infrastructure only" (DBs) versus "full stack" (DBs + APIs).
*   Volume mapping must be configured to ensure database state survives container restarts during development.

## Future Considerations
If the architecture grows to dozens of microservices, Docker Compose may become too heavy for a single laptop. At that point, we may adopt tools like Telepresence to run specific services locally while connected to a remote staging cluster.
