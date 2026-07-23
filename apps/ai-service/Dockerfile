# Build Stage
FROM python:3.11-slim AS builder
ENV POETRY_VERSION=1.8.2 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_NO_INTERACTION=1

# Install Poetry
RUN pip install "poetry==$POETRY_VERSION"
WORKDIR /app
COPY pyproject.toml poetry.lock ./
# Install dependencies
RUN poetry install --no-root --without dev

# Runtime Stage
FROM python:3.11-slim
WORKDIR /app
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1

# Add non-root user
RUN addgroup --system shadowgrp && adduser --system --group shadowusr
USER shadowusr

COPY --from=builder /app/.venv ./.venv
COPY . .

EXPOSE 8000
ENTRYPOINT ["uvicorn", "ai_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
