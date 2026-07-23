package com.shadowengineer.core.service;

import com.shadowengineer.core.domain.GeneratedArtifact;
import com.shadowengineer.core.domain.GitRepository;
import com.shadowengineer.core.repository.GeneratedArtifactRepository;
import com.shadowengineer.core.repository.GitRepositoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArtifactService {

    private final GeneratedArtifactRepository artifactRepository;
    private final GitRepositoryRepository gitRepositoryRepository;

    public List<GeneratedArtifact> getArtifacts(UUID repositoryId, String type) {
        if (type != null && !type.isBlank()) {
            return artifactRepository.findByRepositoryIdAndTypeOrderByCreatedAtDesc(repositoryId, type.toUpperCase());
        }
        return artifactRepository.findByRepositoryIdOrderByCreatedAtDesc(repositoryId);
    }

    public GeneratedArtifact getArtifact(UUID artifactId) {
        return artifactRepository.findById(artifactId)
                .orElseThrow(() -> new IllegalArgumentException("Artifact not found"));
    }

    @Transactional
    public GeneratedArtifact createArtifact(UUID repositoryId, String type, String title) {
        GitRepository repo = gitRepositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new IllegalArgumentException("Repository not found"));

        GeneratedArtifact artifact = GeneratedArtifact.builder()
                .repository(repo)
                .type(type.toUpperCase())
                .title(title)
                .content("") // Empty until AI completes
                .status("PENDING")
                .build();

        return artifactRepository.save(artifact);
    }

    @Transactional
    public GeneratedArtifact updateArtifactContent(UUID artifactId, String content, String status) {
        GeneratedArtifact artifact = artifactRepository.findById(artifactId)
                .orElseThrow(() -> new IllegalArgumentException("Artifact not found"));
        
        artifact.setContent(content);
        artifact.setStatus(status);
        
        return artifactRepository.save(artifact);
    }
}
