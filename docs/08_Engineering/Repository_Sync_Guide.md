# Repository Sync Guide

This guide details the background processing architecture for cloning and parsing repositories.

## Workflow

1. **Authentication:** The user provides a GitHub Personal Access Token (PAT).
2. **Metadata Import:** The `GithubIntegrationService` connects to the GitHub API via Kohsuke and fetches a list of `GHRepository` objects. It populates the `repositories` table.
3. **Background Cloning:** The `RepositoryCloneService` uses JGit within a `@Async` thread pool (`repositoryTaskExecutor`) to clone the repository to disk (`/tmp/shadow-engineer/repos/{uuid}`).
4. **Static Analysis Engine (FastAPI):** Once cloned, the backend sends a trigger to the AI Service (`POST /api/v1/analyze`).
5. **Parsing:** The AI service walks the file tree, skipping binaries and `.git` folders. It computes:
   - Total Lines of Code (LOC)
   - Language Distribution (via Pygments)
   - Cyclomatic Complexity (via Radon for Python files)
6. **Result:** The `sync_status` transitions from `PENDING` -> `CLONING` -> `SYNCED`.

## Thread Pool Configuration
The thread pool for cloning is defined in `AsyncConfig.java`. Adjust `CorePoolSize` and `MaxPoolSize` based on disk I/O capabilities.
