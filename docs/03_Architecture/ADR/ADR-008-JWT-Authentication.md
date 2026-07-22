# ADR 008: Adoption of JWT for Authentication

## Status
Approved

## Context
Shadow Engineer must authenticate requests from the Next.js web application, the VS Code extension, and potentially third-party API clients.

## Problem Statement
We need a secure, stateless, and scalable mechanism to verify user identity and permissions across multiple disparate services (Java and Python) without querying the database on every request.

## Decision
We will use JSON Web Tokens (JWT) signed with RS256 (asymmetric keys) for stateless authentication.

## Alternatives Considered
*   **Stateful Session Cookies:** Highly secure for browsers, but very difficult to scale across microservices and incompatible with VS Code extensions or standard REST API clients.
*   **Opaque API Tokens (Database Lookup):** Allows instant revocation, but requires a database or Redis lookup on every single API request, increasing latency.

## Pros
*   Stateless validation: Any service (Java or Python) can verify the token signature using the public key without hitting the database.
*   Standardized and widely supported across all languages.
*   Carries user claims (roles, organization IDs) directly within the payload.

## Cons
*   Cannot be easily revoked before expiration (requires a Redis blacklist).
*   Payload is base64 encoded, not encrypted (sensitive data cannot be stored in the token).

## Trade-offs
We trade the instant revocation capabilities of stateful sessions for the extreme scalability and low latency of stateless verification.

## Consequences
*   We must implement short-lived Access Tokens (e.g., 15 minutes) and long-lived Refresh Tokens (e.g., 7 days).
*   The API Gateway will cache the public key and validate JWTs before routing traffic to internal services.

## Future Considerations
If token hijacking becomes a significant threat vector, we will implement strict IP binding or MTLS for enterprise API clients.
