package com.shadowengineer.core.controller;

import com.shadowengineer.core.domain.GeneratedArtifact;
import com.shadowengineer.core.service.ArtifactService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/repositories/{repositoryId}/artifacts")
@RequiredArgsConstructor
public class ArtifactController {

    private final ArtifactService artifactService;

    @GetMapping
    public ResponseEntity<List<GeneratedArtifact>> getArtifacts(
            @PathVariable UUID repositoryId,
            @RequestParam(required = false) String type
    ) {
        return ResponseEntity.ok(artifactService.getArtifacts(repositoryId, type));
    }

    @GetMapping("/{artifactId}")
    public ResponseEntity<GeneratedArtifact> getArtifact(@PathVariable UUID artifactId) {
        return ResponseEntity.ok(artifactService.getArtifact(artifactId));
    }

    @PostMapping
    public ResponseEntity<GeneratedArtifact> createArtifact(
            @PathVariable UUID repositoryId,
            @RequestBody CreateArtifactRequest request
    ) {
        return ResponseEntity.ok(artifactService.createArtifact(repositoryId, request.getType(), request.getTitle()));
    }

    @PostMapping("/{artifactId}/complete")
    public ResponseEntity<GeneratedArtifact> completeArtifact(
            @PathVariable UUID artifactId,
            @RequestBody CompleteArtifactRequest request
    ) {
        return ResponseEntity.ok(artifactService.updateArtifactContent(artifactId, request.getContent(), request.getStatus()));
    }

    @Data
    static class CreateArtifactRequest {
        private String type;
        private String title;
    }

    @Data
    static class CompleteArtifactRequest {
        private String content;
        private String status;
    }
}
