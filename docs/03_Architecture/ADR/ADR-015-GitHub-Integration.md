# ADR 015: Adoption of GitHub Apps for Integration

## Status
Approved

## Context
Shadow Engineer must react instantly to developer actions (commits, Pull Requests, Issue creation) and perform actions on their behalf (commenting on PRs, merging code).

## Problem Statement
We need a secure, scalable, and tightly integrated method to interact with the GitHub ecosystem without relying on fragile user-provided Personal Access Tokens (PATs).

## Decision
We will build integration exclusively via the GitHub Apps infrastructure.

## Alternatives Considered
*   **OAuth Apps:** Authenticates users, but acts entirely on behalf of the user, consuming their personal API rate limits and failing if the user leaves the organization.
*   **Service Account PATs:** Requires manual key management, lacks granular permissions, and poses massive security risks if leaked.

## Pros
*   **Granular Permissions:** We request exactly what we need (e.g., Read access to Code, Write access to Pull Requests), enhancing security and customer trust.
*   **Higher Rate Limits:** GitHub Apps have significantly higher API rate limits scaled per installation.
*   **Webhooks Built-In:** First-class support for receiving immediate webhook payloads for repository events.
*   **Bot Identity:** Actions performed by Shadow Engineer appear clearly as a Bot, not as a human user.

## Cons
*   Requires complex cryptographic token generation (signing JWTs with a private key to request temporary Installation Access Tokens).
*   Handling webhook delivery failures requires robust retry and Dead Letter Queue (DLQ) mechanisms on our end.

## Trade-offs
We trade the simplicity of static API tokens for the robust security, granular scoping, and superior rate limits of a first-class GitHub App.

## Consequences
*   The Java Core must implement robust webhook signature validation to ensure payloads actually originate from GitHub.
*   The system must dynamically request and cache short-lived Installation Access Tokens (valid for 1 hour) for all GitHub API interactions.

## Future Considerations
While the MVP targets GitHub, the architecture (specifically the Event Normalization layer) must remain agnostic to allow future integrations with GitLab and Bitbucket using their respective App/Webhook infrastructures.
