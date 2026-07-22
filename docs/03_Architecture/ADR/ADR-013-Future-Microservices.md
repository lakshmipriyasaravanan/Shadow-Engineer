# ADR 013: Future Transition to Microservices (via Kafka)

## Status
Approved

## Context
As Shadow Engineer acquires enterprise customers, the volume of incoming webhooks and AI analysis requests will scale non-linearly. The Modular Monolith will eventually face hardware limits and team contention bottlenecks.

## Problem Statement
We need a predefined strategy to transition from a Modular Monolith to a Distributed Microservices architecture without rewriting the platform.

## Decision
We will migrate to an event-driven Microservices architecture using Apache Kafka as the central nervous system, executed in progressive phases post-MVP.

## Alternatives Considered
*   **Synchronous REST/gRPC Microservices:** Leads to tight temporal coupling, cascading failures, and distributed monolith anti-patterns.
*   **RabbitMQ:** Excellent for task queues, but lacks the durable log, event sourcing capabilities, and massive horizontal scaling of Kafka.

## Pros
*   Services are completely decoupled; producers do not care who consumes the events.
*   Kafka provides a durable, replayable log of all system actions (vital for auditing and analytics).
*   Allows specific modules (e.g., Repo Ingestion) to scale infinitely based on queue lag.

## Cons
*   Kafka is notoriously complex to operate and manage.
*   Eventual consistency forces UI paradigms to change (e.g., polling or WebSockets instead of blocking HTTP responses).

## Trade-offs
We trade the simplicity of atomic database transactions for infinite horizontal scalability and resilient, asynchronous processing.

## Consequences
*   We must implement the Saga Pattern (Choreography) to manage distributed transactions (e.g., rollback billing if repo ingestion fails).
*   We must deploy Kafka clusters (or use MSK/Confluent Cloud) and schema registries.

## Future Considerations
To prevent event schema drift, we will adopt Avro or Protobuf for strict event schema validation before messages are published to Kafka.
