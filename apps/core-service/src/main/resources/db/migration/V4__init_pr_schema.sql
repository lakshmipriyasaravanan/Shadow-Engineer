CREATE TABLE pull_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
    github_pr_id BIGINT NOT NULL,
    number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    state VARCHAR(50) NOT NULL,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(repository_id, github_pr_id)
);

CREATE TABLE pull_request_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pull_request_id UUID REFERENCES pull_requests(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    executive_summary TEXT,
    security_score INTEGER,
    maintainability_score INTEGER,
    performance_score INTEGER,
    ai_comments_json TEXT, -- Stores JSON array of inline suggestions/comments
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_prs_repo_id ON pull_requests(repository_id);
CREATE INDEX idx_pr_reviews_pr_id ON pull_request_reviews(pull_request_id);
