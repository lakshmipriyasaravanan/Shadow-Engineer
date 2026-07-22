package com.shadowengineer.core.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "repositories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GitRepository extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Column(name = "github_id", unique = true)
    private Long githubId;

    @Column(nullable = false)
    private String name;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 1024)
    private String url;

    @Column(name = "clone_url", length = 1024)
    private String cloneUrl;

    @Column(name = "default_branch")
    private String defaultBranch;

    @Column(name = "is_private")
    private boolean isPrivate;

    @Column
    private String language;

    @Column(name = "sync_status")
    private String syncStatus;

    @Column(name = "last_synced_at")
    private OffsetDateTime lastSyncedAt;
}
