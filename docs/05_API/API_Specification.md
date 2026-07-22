---
Project Name: Shadow Engineer
Document: API Specification
Version: 1.0.0
Status: Draft
Author: Lakshmi Priya Saravanan
Date: 2026-07-22
---

# Shadow Engineer: API Specification

## 1. Global API Strategies

### API Versioning Strategy
APIs are versioned via the URL path (e.g., `/api/v1/...`). Major breaking changes require a new version (`v2`). Minor, backward-compatible additions (e.g., new response fields) do not change the version.

### Pagination Strategy
Cursor-based pagination is used for high-frequency collections (e.g., Chat History, Notifications) for performance. Offset-based pagination (`page`, `limit`) is used for static collections (e.g., Users, Organizations). Responses include a `meta` block with `next_cursor` or `total_pages`.

### Sorting, Filtering, and Search
*   **Sorting:** Handled via the `sort` query parameter (e.g., `?sort=-created_at` for descending).
*   **Filtering:** Handled via precise query parameters (e.g., `?status=ACTIVE`).
*   **Search:** Handled via the `q` query parameter for full-text search.

### Field Selection
To minimize payload size, clients can request specific fields using the `fields` parameter: `?fields=id,name,email`.

### Error Handling Standard
We utilize RFC 7807 (Problem Details for HTTP APIs).
```json
{
  "type": "https://api.shadowengineer.com/errors/resource-not-found",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "Repository with ID '123' does not exist.",
  "instance": "/api/v1/repos/123",
  "correlation_id": "req-xyz-789"
}
```

### Correlation IDs & Request Tracing
Every request must accept an optional `X-Correlation-ID`. If missing, the API Gateway generates one. This ID is passed to all downstream services (Java, Python) and returned in the response headers. `X-Trace-ID` is used internally by OpenTelemetry.

### API Gateway Responsibilities
The API Gateway handles TLS termination, JWT signature validation, global rate limiting, CORS, and request routing.

### Rate Limiting Policy
*   **Public endpoints:** 10 requests / minute / IP.
*   **Authenticated users:** 1,000 requests / minute / tenant.
*   **AI generation endpoints:** 50 requests / minute / tenant (burst limit: 100).

---

## 2. API Modules

### 2.1 Authentication

*   **Overview:** Handles GitHub OAuth flow and issues JWTs.
*   **Endpoint:** `POST /api/v1/auth/github`
*   **HTTP Method:** POST
*   **Authentication:** Public
*   **Request Headers:** `Content-Type: application/json`, `X-Correlation-ID`
*   **Request Body:**
    *   `code` (String, Required): GitHub OAuth code.
*   **Success Response (200 OK):**
    ```json
    { "access_token": "jwt...", "refresh_token": "jwt..." }
    ```
*   **Error Responses:** 401 Unauthorized (`invalid_grant`).
*   **Validation:** Code must be a non-empty string.
*   **Rate Limiting:** 10 req/min.
*   **Idempotency:** Non-idempotent.
*   **Security:** Rate-limited to prevent brute-forcing.

### 2.2 Organization Management

*   **Overview:** Retrieves tenant organization details.
*   **Endpoint:** `GET /api/v1/organizations/{orgId}`
*   **Authentication:** JWT (Tenant Member)
*   **Success Response (200 OK):**
    ```json
    { "id": "uuid", "name": "Acme Corp", "billing_plan": "PRO" }
    ```
*   **Security:** RLS enforces that only users belonging to `orgId` can fetch this data.

### 2.3 Team Management

*   **Overview:** Creates a new team within an organization.
*   **Endpoint:** `POST /api/v1/organizations/{orgId}/teams`
*   **Authentication:** JWT (Admin Only)
*   **Success Response (201 Created):**
    ```json
    { "id": "uuid", "name": "Backend Guild" }
    ```
*   **Idempotency:** Non-idempotent (creates new resource).

### 2.4 User Management

*   **Overview:** Retrieves the current authenticated user's profile.
*   **Endpoint:** `GET /api/v1/users/me`
*   **Authentication:** JWT
*   **Success Response (200 OK):**
    ```json
    { "id": "uuid", "email": "dev@acme.com", "github_username": "acmedev" }
    ```

### 2.5 Repository Management

*   **Overview:** Initiates the ingestion of a GitHub repository.
*   **Endpoint:** `POST /api/v1/repositories`
*   **Authentication:** JWT (Role Required: Admin)
*   **Request Body:**
    *   `github_repo_id` (String, Required).
*   **Success Response (202 Accepted):**
    ```json
    { "id": "uuid", "status": "INGESTING", "job_id": "job-123" }
    ```
*   **Idempotency:** Idempotent (if already ingesting, returns existing status).

### 2.6 Repository Analysis

*   **Overview:** Fetches the semantic index status of a repository.
*   **Endpoint:** `GET /api/v1/repositories/{repoId}/analysis/status`
*   **Authentication:** JWT

### 2.7 AI Repository Chat

*   **Overview:** Streams a response from the RAG engine based on a user's prompt.
*   **Endpoint:** `POST /api/v1/ai/chat`
*   **Authentication:** JWT
*   **Request Body:**
    *   `repository_id` (UUID, Required)
    *   `prompt` (String, Required)
*   **Success Response (200 OK - text/event-stream):** Streams chunked markdown strings.
*   **Security:** User must have access to `repository_id`. Input sanitization against Prompt Injection.

### 2.8 AI Code Review

*   **Overview:** Triggers a manual AI review of a specific Pull Request.
*   **Endpoint:** `POST /api/v1/ai/review`
*   **Authentication:** JWT
*   **Request Body:** `pull_request_url` (String, Required).

### 2.9 Documentation Generator

*   **Overview:** Generates a `README.md` based on repository context.
*   **Endpoint:** `POST /api/v1/ai/generate-docs`
*   **Authentication:** JWT

### 2.10 Test Generator

*   **Overview:** Generates unit tests for a specific file.
*   **Endpoint:** `POST /api/v1/ai/generate-tests`
*   **Authentication:** JWT
*   **Request Body:** `file_path` (String, Required).

### 2.11 Analytics Dashboard

*   **Overview:** Retrieves token usage for an organization over a date range.
*   **Endpoint:** `GET /api/v1/analytics/usage`
*   **Authentication:** JWT (Admin Only)

### 2.12 Notifications

*   **Overview:** Retrieves unread user notifications.
*   **Endpoint:** `GET /api/v1/notifications?status=UNREAD`
*   **Authentication:** JWT

### 2.13 Admin Portal

*   **Overview:** Updates the global platform AI LLM configuration.
*   **Endpoint:** `PUT /api/v1/admin/settings/llm`
*   **Authentication:** JWT (SuperAdmin Only)

### 2.14 Settings

*   **Overview:** Updates organization billing preferences.
*   **Endpoint:** `PATCH /api/v1/organizations/{orgId}/settings`
*   **Authentication:** JWT (Admin Only)

### 2.15 Health & Monitoring

*   **Overview:** Liveness probe for Kubernetes.
*   **Endpoint:** `GET /actuator/health`
*   **Authentication:** Public (Internal VPC Only)
