# ADR 007: Adoption of Spring Cloud Gateway

## Status
Approved

## Context
The platform consists of a frontend, a Java Core API, and a Python AI API. We need a unified entry point to handle cross-cutting concerns like security and routing.

## Problem Statement
Exposing internal microservices directly to the internet is insecure and creates tight coupling between the client and backend infrastructure. We need a robust reverse proxy/API Gateway.

## Decision
We will use Spring Cloud Gateway as the central API Gateway.

## Alternatives Considered
*   **NGINX:** Industry standard reverse proxy, but configuring dynamic routing, JWT validation, and complex rate limiting requires writing Lua scripts.
*   **AWS API Gateway:** Managed service, but causes cloud lock-in and is difficult to replicate in local Docker development.
*   **Kong:** Excellent, but introduces another complex technology stack (Lua/Postgres) just for routing.

## Pros
*   Natively integrates with our Spring Boot ecosystem.
*   Allows us to write custom global filters (JWT validation, tracing injection) in Java.
*   Built on Project Reactor, providing non-blocking I/O capable of handling massive webhook spikes.

## Cons
*   Requires understanding of reactive programming (WebFlux) for custom filter development.
*   Java memory footprint is higher than a compiled C binary like NGINX.

## Trade-offs
We trade the raw performance and low memory footprint of NGINX for the developer velocity and seamless ecosystem integration of Spring Cloud Gateway.

## Consequences
*   All inbound traffic (Web and Webhooks) must route through the Gateway.
*   The Gateway will be responsible for validating JWT signatures before forwarding requests, ensuring downstream services trust incoming traffic.

## Future Considerations
If we migrate to a massive Kubernetes deployment, we may replace Spring Cloud Gateway with an Ingress Controller like Istio or Traefik to offload routing to the infrastructure layer.
