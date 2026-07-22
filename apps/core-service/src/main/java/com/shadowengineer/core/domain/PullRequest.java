package com.shadowengineer.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "pull_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PullRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private GitRepository repository;

    @Column(name = "github_pr_id", nullable = false)
    private Long githubPrId;

    @Column(nullable = false)
    private Integer number;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String author;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
