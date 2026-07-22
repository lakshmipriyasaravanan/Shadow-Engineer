# Authentication Setup Guide

This guide explains how to configure Identity and Access Management (IAM) for Shadow Engineer.

## JWT Configuration
The backend issues JWT access tokens upon successful login.
1. Generate a strong, 256-bit (32 byte) Hex or Base64 secret.
2. Store it in your environment:
   `JWT_SECRET=your_super_secret_key`

## Spring Security Flow
1. **Filter:** `JwtAuthenticationFilter` intercepts incoming requests.
2. **Extraction:** It looks for the `Authorization: Bearer <token>` header.
3. **Validation:** Extracts the username, checks token expiry against the signature, and sets `SecurityContextHolder`.
4. **Authorization:** Endpoints annotated with `@PreAuthorize` evaluate the permissions/roles.

## OAuth2 (Future Implementation)
To enable GitHub/Google login:
1. Register an OAuth application in GitHub/Google Cloud.
2. Set the callback URL to `http://localhost:8080/login/oauth2/code/{provider}`.
3. Inject the `clientId` and `clientSecret` into `application.yml`.
