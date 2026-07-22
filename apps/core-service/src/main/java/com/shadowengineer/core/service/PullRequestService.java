package com.shadowengineer.core.service;

import com.shadowengineer.core.domain.GitRepository;
import com.shadowengineer.core.domain.PullRequest;
import com.shadowengineer.core.domain.PullRequestReview;
import com.shadowengineer.core.repository.GitRepositoryRepository;
import com.shadowengineer.core.repository.PullRequestRepository;
import com.shadowengineer.core.repository.PullRequestReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.kohsuke.github.GHIssueState;
import org.kohsuke.github.GHPullRequest;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GitHub;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PullRequestService {

    private final PullRequestRepository pullRequestRepository;
    private final PullRequestReviewRepository pullRequestReviewRepository;
    private final GitRepositoryRepository gitRepositoryRepository;

    @Transactional
    public List<PullRequest> syncPullRequests(UUID repositoryId, String githubToken) {
        GitRepository repo = gitRepositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new IllegalArgumentException("Repository not found"));

        try {
            GitHub github = GitHub.connectUsingOAuth(githubToken);
            GHRepository ghRepo = github.getRepositoryById(String.valueOf(repo.getGithubId()));
            
            List<GHPullRequest> ghPullRequests = ghRepo.getPullRequests(GHIssueState.ALL);
            
            for (GHPullRequest ghPr : ghPullRequests) {
                PullRequest pr = pullRequestRepository.findByRepositoryIdAndGithubPrId(repositoryId, ghPr.getId())
                        .orElse(PullRequest.builder()
                                .repository(repo)
                                .githubPrId(ghPr.getId())
                                .build());
                
                pr.setNumber(ghPr.getNumber());
                pr.setTitle(ghPr.getTitle());
                pr.setState(ghPr.getState().name());
                pr.setAuthor(ghPr.getUser().getLogin());
                pr.setCreatedAt(ghPr.getCreatedAt().toInstant().atOffset(ZoneOffset.UTC));
                
                pullRequestRepository.save(pr);
            }
            
            return pullRequestRepository.findByRepositoryIdOrderByCreatedAtDesc(repositoryId);
            
        } catch (IOException e) {
            log.error("Failed to sync pull requests from GitHub", e);
            throw new RuntimeException("Failed to sync pull requests", e);
        }
    }

    public List<PullRequest> getPullRequests(UUID repositoryId) {
        return pullRequestRepository.findByRepositoryIdOrderByCreatedAtDesc(repositoryId);
    }

    public PullRequestReview getPullRequestReview(UUID pullRequestId) {
        return pullRequestReviewRepository.findByPullRequestId(pullRequestId)
                .orElse(null);
    }

    @Transactional
    public PullRequestReview completeReview(UUID pullRequestId, String aiResponseJson) {
        PullRequest pr = pullRequestRepository.findById(pullRequestId)
                .orElseThrow(() -> new IllegalArgumentException("PR not found"));

        PullRequestReview review = pullRequestReviewRepository.findByPullRequestId(pullRequestId)
                .orElse(PullRequestReview.builder().pullRequest(pr).build());
        
        // For prototype, we'll extract the scores using Jackson later. 
        // For now, save the raw json and update status.
        review.setStatus("COMPLETED");
        review.setAiCommentsJson(aiResponseJson);
        review.setCompletedAt(java.time.OffsetDateTime.now());
        
        return pullRequestReviewRepository.save(review);
    }
}
