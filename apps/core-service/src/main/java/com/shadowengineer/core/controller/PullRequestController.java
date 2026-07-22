package com.shadowengineer.core.controller;

import com.shadowengineer.core.domain.PullRequest;
import com.shadowengineer.core.domain.PullRequestReview;
import com.shadowengineer.core.service.PullRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/repositories/{repositoryId}/prs")
@RequiredArgsConstructor
public class PullRequestController {

    private final PullRequestService pullRequestService;

    @GetMapping
    public ResponseEntity<List<PullRequest>> getPullRequests(@PathVariable UUID repositoryId) {
        return ResponseEntity.ok(pullRequestService.getPullRequests(repositoryId));
    }

    @PostMapping("/sync")
    public ResponseEntity<List<PullRequest>> syncPullRequests(
            @PathVariable UUID repositoryId,
            @RequestHeader("X-GitHub-Token") String githubToken
    ) {
        return ResponseEntity.ok(pullRequestService.syncPullRequests(repositoryId, githubToken));
    }

    @GetMapping("/{pullRequestId}/review")
    public ResponseEntity<PullRequestReview> getReview(@PathVariable UUID pullRequestId) {
        PullRequestReview review = pullRequestService.getPullRequestReview(pullRequestId);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(review);
    }

    @PostMapping("/{pullRequestId}/review/complete")
    public ResponseEntity<PullRequestReview> completeReview(
            @PathVariable UUID pullRequestId,
            @RequestBody String aiResponseJson
    ) {
        return ResponseEntity.ok(pullRequestService.completeReview(pullRequestId, aiResponseJson));
    }
}
