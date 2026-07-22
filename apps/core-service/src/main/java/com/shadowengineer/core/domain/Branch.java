package com.shadowengineer.core.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "branches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Branch extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private GitRepository repository;

    @Column(nullable = false)
    private String name;

    @Column(name = "commit_sha", nullable = false, length = 40)
    private String commitSha;
}
