# ADR 012: Adoption of Modular Monolith for MVP

## Status
Approved

## Context
Shadow Engineer aims to go to market within 6 months. It requires complex domain logic (Authentication, Billing, Orchestration, Analytics).

## Problem Statement
We need an architectural pattern that allows for high iteration velocity, straightforward debugging, and simple deployments, without trapping the system in spaghetti code that prevents future scaling.

## Decision
We will adopt a Modular Monolith architecture for the core Java backend during the MVP phase.

## Alternatives Considered
*   **Microservices:** Highly scalable, but introduces massive operational overhead (network latency, distributed tracing, eventual consistency, complex CI/CD) that kills velocity for early-stage startups.
*   **Traditional Monolith (Big Ball of Mud):** Fast initially, but quickly devolves into unmaintainable spaghetti code with tightly coupled domains, making extraction impossible later.

## Pros
*   Single deployment unit simplifies DevOps drastically.
*   Local method calls are used instead of network hops, ensuring low latency.
*   Strict module boundaries (enforced by Java packages or ArchUnit) guarantee code remains decoupled.
*   Allows atomic database transactions across domains.

## Cons
*   Cannot scale individual domains independently (e.g., if Analytics needs more RAM, the whole application scales).
*   Requires strict engineering discipline to prevent domain leakage.

## Trade-offs
We trade the independent scalability of microservices for maximum developer velocity and operational simplicity during the critical MVP phase.

## Consequences
*   We must use tools like ArchUnit to enforce strict boundary rules (e.g., the Billing module cannot directly access the Auth module's database tables).
*   Domain communication should utilize Spring Application Events to simulate asynchronous message passing.

## Future Considerations
Once product-market fit is achieved and scaling bottlenecks are identified, strict modular boundaries will allow us to effortlessly carve out domains into independent microservices.
