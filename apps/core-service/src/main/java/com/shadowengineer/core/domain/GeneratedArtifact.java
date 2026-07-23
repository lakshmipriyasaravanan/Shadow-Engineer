package com.shadowengineer.core.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "generated_artifacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneratedArtifact extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private GitRepository repository;

    @Column(nullable = false)
    private String type; // 'DOCUMENTATION', 'DIAGRAM', 'TEST'

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String status; // 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'
}
