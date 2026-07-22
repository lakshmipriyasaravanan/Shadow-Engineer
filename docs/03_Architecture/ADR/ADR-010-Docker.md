# ADR 010: Adoption of Docker for Containerization

## Status
Approved

## Context
Shadow Engineer relies on multiple languages (Java, Python, TypeScript) and backing services (PostgreSQL, Redis, Qdrant). 

## Problem Statement
We need a consistent, reproducible way to build, package, and deploy these services across local development environments, CI/CD pipelines, and cloud production infrastructure.

## Decision
We will use Docker to containerize all custom applications and infrastructure dependencies.

## Alternatives Considered
*   **Virtual Machines (EC2/AMI):** Slower boot times, heavier resource footprint, and prone to "it works on my machine" configuration drift.
*   **Serverless (AWS Lambda):** Excellent for unpredictable workloads, but entirely unsuited for the Spring Boot JVM startup times and long-running web socket connections required for IDE chat.

## Pros
*   Guarantees parity between local development and production environments.
*   Rapid startup and lightweight resource utilization compared to VMs.
*   Industry standard supported by ECS, EKS, and GitHub Actions.

## Cons
*   Requires knowledge of Dockerfile optimization (multi-stage builds) to keep image sizes small.
*   Managing container networking and storage volumes can be complex.

## Trade-offs
We trade the simplicity of bare-metal deployments for the strict isolation, consistency, and portability of containers.

## Consequences
*   Every application component must have an optimized, multi-stage `Dockerfile`.
*   CI/CD pipelines must include steps to build, tag, and push images to a container registry (e.g., AWS ECR or GitHub Packages).
*   Security scanning (e.g., Trivy) must be integrated to scan Docker layers for vulnerabilities.

## Future Considerations
We will strictly monitor base image sizes, ensuring we use Alpine or Distroless images wherever possible to minimize security attack surfaces.
