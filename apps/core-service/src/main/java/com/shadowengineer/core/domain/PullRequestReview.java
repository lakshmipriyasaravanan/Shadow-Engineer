package com.shadowengineer.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "pull_request_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PullRequestReview extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pull_request_id", nullable = false)
    private PullRequest pullRequest;

    @Column(nullable = false)
    private String status; // PENDING, PROCESSING, COMPLETED, FAILED

    @Column(name = "executive_summary", columnDefinition = "TEXT")
    private String executiveSummary;

    @Column(name = "security_score")
    private Integer securityScore;

    @Column(name = "maintainability_score")
    private Integer maintainabilityScore;

    @Column(name = "performance_score")
    private Integer performanceScore;

    @Column(name = "ai_comments_json", columnDefinition = "TEXT")
    private String aiCommentsJson; // Stores JSON array of inline suggestions/comments

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;
}
