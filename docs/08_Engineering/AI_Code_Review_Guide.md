# AI Code Review Guide

The Shadow Engineer platform provides automated Pull Request reviews leveraging LLMs and structured outputs.

## Architecture

1. **GitHub Synchronization:** The Spring Boot backend uses Kohsuke's `github-api` to sync PR metadata into the PostgreSQL `pull_requests` table.
2. **Review Trigger:** The Next.js frontend calls `POST /api/v1/review/trigger` on the Python FastAPI service.
3. **Background Processing (Redis):** The FastAPI service pushes the task to an RQ worker (`pr_review_queue`).
4. **Structured Output Enforcement:** The `prompts.py` module instructs the LLM (e.g. gpt-4o) to output strictly valid JSON matching a specific schema. This ensures the UI can dependably parse Executive Summaries, Scores, and Inline Comments.
5. **Webhook Completion:** Once the LLM finishes, the worker issues an HTTP POST to the Spring Boot Core Service (`/prs/{id}/review/complete`), which persists the JSON securely into the `pull_request_reviews` table.

## AI Scoring Algorithm
The LLM generates scores out of 100 for three primary pillars:
- **Security:** Evaluates OWASP Top 10 vulnerabilities (SQLi, XSS, SSRF).
- **Maintainability:** Evaluates SOLID principles, Cyclomatic Complexity, and naming conventions.
- **Performance:** Evaluates Big-O complexity, memory leaks, and inefficient database queries.
