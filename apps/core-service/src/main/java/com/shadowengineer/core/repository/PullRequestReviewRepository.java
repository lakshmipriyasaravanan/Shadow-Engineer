package com.shadowengineer.core.repository;

import com.shadowengineer.core.domain.PullRequestReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PullRequestReviewRepository extends JpaRepository<PullRequestReview, UUID> {
    Optional<PullRequestReview> findByPullRequestId(UUID pullRequestId);
}
