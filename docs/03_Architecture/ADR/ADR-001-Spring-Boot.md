# ADR 001: Adoption of Spring Boot for Core Backend

## Status
Approved

## Context
Shadow Engineer requires a highly reliable, concurrent, and secure backend to handle business logic, billing, orchestration, and integrations. The system must support high throughput for webhooks.

## Problem Statement
We need a backend framework that provides robust enterprise features (security, ORM, transaction management) out-of-the-box while maintaining excellent developer productivity and performance.

## Decision
We will use Spring Boot 3 with Java 21 as the foundational framework for the Core API.

## Alternatives Considered
*   **Go (Golang):** Excellent concurrency and performance, but lacks the mature, out-of-the-box enterprise ecosystem of Spring (e.g., Spring Security, Spring Data).
*   **Node.js / Express:** Fast iteration, but lacks strong multithreading capabilities for CPU-heavy tasks without complex worker threads, and loose typing can lead to runtime errors at scale.

## Pros
*   Massive enterprise ecosystem and community support.
*   Java 21 Virtual Threads provide Go-like concurrency without reactive programming complexity.
*   Seamless integration with Spring Security, Spring Data JPA, and OAuth2.

## Cons
*   Higher memory footprint compared to Go or Rust.
*   Slower startup times (mitigated in production via long-running instances).

## Trade-offs
We are trading lower memory consumption and instant startup times for ecosystem maturity, security features, and developer velocity in complex domain modeling.

## Consequences
*   The team must be proficient in Java and the Spring ecosystem.
*   Container resources must be provisioned with adequate memory limits (e.g., 512MB+ per pod).

## Future Considerations
If startup times become a bottleneck (e.g., for serverless functions), we may investigate Spring Native (GraalVM) compilation.
