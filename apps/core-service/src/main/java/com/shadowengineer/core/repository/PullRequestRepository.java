package com.shadowengineer.core.repository;

import com.shadowengineer.core.domain.PullRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PullRequestRepository extends JpaRepository<PullRequest, UUID> {
    List<PullRequest> findByRepositoryIdOrderByCreatedAtDesc(UUID repositoryId);
    Optional<PullRequest> findByRepositoryIdAndGithubPrId(UUID repositoryId, Long githubPrId);
}
