# ADR 004: Adoption of Redis for Caching and Transient State

## Status
Approved

## Context
The system processes thousands of webhooks, requires rate limiting across tenants, and needs to manage user sessions/refresh tokens securely.

## Problem Statement
We need a low-latency, in-memory data store to handle rate limiting, caching of frequently accessed architectural patterns, and temporary state orchestration.

## Decision
We will use Redis as our primary caching and in-memory data structure store.

## Alternatives Considered
*   **Memcached:** Faster for simple key-value lookups, but lacks advanced data structures (Lists, Sets, Hashes) necessary for complex rate limiting and queuing.
*   **Hazelcast:** Excellent for Java-centric caching, but harder to integrate across polyglot architectures (Java + Python).

## Pros
*   Sub-millisecond latency.
*   Supports advanced data structures.
*   Can be used as a lightweight message broker (Pub/Sub) during the MVP phase before introducing Kafka.
*   Easily managed via AWS ElastiCache.

## Cons
*   Data must fit entirely in RAM, making it expensive for large datasets.
*   Data loss is possible if persistence (AOF/RDB) is not configured correctly.

## Trade-offs
We trade memory capacity constraints and higher infrastructure costs (RAM) for ultra-low latency access to critical transient data.

## Consequences
*   We must strictly define TTL (Time-To-Live) for all cached items to prevent memory exhaustion.
*   Redis will be a critical single point of failure; High Availability (Redis Sentinel or Cluster) is required for production.

## Future Considerations
If queueing requirements exceed Redis's capabilities, we will migrate message brokering to Apache Kafka, relegating Redis strictly to caching and rate limiting.
