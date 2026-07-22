# ADR 009: Adoption of OAuth2 for Identity Federation

## Status
Approved

## Context
Shadow Engineer integrates deeply with GitHub repositories. Users must authenticate and grant the platform permission to read their code and post Pull Request comments.

## Problem Statement
We need a secure way to authenticate users and obtain authorization tokens to interact with GitHub APIs on their behalf, without ever storing user passwords.

## Decision
We will use OAuth2 (Authorization Code Flow) with GitHub as the primary Identity Provider (IdP).

## Alternatives Considered
*   **Custom Username/Password:** Forces users to create new credentials, severely degrading the onboarding experience. Does not provide access to GitHub APIs.
*   **SAML:** Required for enterprise Single Sign-On (SSO), but overly complex for individual developers or startup teams during the MVP phase.

## Pros
*   Frictionless onboarding ("Login with GitHub").
*   Simultaneously authenticates the user and provides an access token to interact with their repositories.
*   Industry standard protocol supported by Spring Security.

## Cons
*   Ties our authentication availability to GitHub's uptime.
*   OAuth token lifecycle management (refreshing GitHub tokens) adds complexity.

## Trade-offs
We trade complete control over identity management for a vastly superior user experience and secure API delegation.

## Consequences
*   We must securely store GitHub OAuth access/refresh tokens in PostgreSQL (encrypted at rest).
*   The Auth Service must handle token refreshing seamlessly in the background.

## Future Considerations
As we target enterprise clients, we will expand the authentication layer to support SAML 2.0 and OpenID Connect (OIDC) for integration with Okta, Azure AD, and Google Workspace.
