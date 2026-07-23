package com.shadowengineer.core.repository;

import com.shadowengineer.core.domain.GeneratedArtifact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GeneratedArtifactRepository extends JpaRepository<GeneratedArtifact, UUID> {
    List<GeneratedArtifact> findByRepositoryIdOrderByCreatedAtDesc(UUID repositoryId);
    List<GeneratedArtifact> findByRepositoryIdAndTypeOrderByCreatedAtDesc(UUID repositoryId, String type);
}
