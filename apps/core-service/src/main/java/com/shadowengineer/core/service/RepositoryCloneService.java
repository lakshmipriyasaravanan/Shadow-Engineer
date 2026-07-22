package com.shadowengineer.core.service;

import com.shadowengineer.core.domain.GitRepository;
import com.shadowengineer.core.repository.GitRepositoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.OffsetDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class RepositoryCloneService {

    private final GitRepositoryRepository gitRepositoryRepository;
    private static final String CLONE_DIR_BASE = "/tmp/shadow-engineer/repos/";

    @Async("repositoryTaskExecutor")
    @Transactional
    public void cloneAndProcessRepository(GitRepository repository, String personalAccessToken) {
        log.info("Starting async clone for repository: {}", repository.getFullName());
        
        repository.setSyncStatus("CLONING");
        gitRepositoryRepository.save(repository);

        Path clonePath = Path.of(CLONE_DIR_BASE, repository.getId().toString());

        try {
            if (Files.exists(clonePath)) {
                log.info("Repository already exists locally. Pulling latest changes...");
                try (Git git = Git.open(clonePath.toFile())) {
                    git.pull()
                        .setCredentialsProvider(new UsernamePasswordCredentialsProvider("token", personalAccessToken))
                        .call();
                }
            } else {
                log.info("Cloning repository from scratch to: {}", clonePath);
                Git.cloneRepository()
                        .setURI(repository.getCloneUrl())
                        .setDirectory(clonePath.toFile())
                        .setCredentialsProvider(new UsernamePasswordCredentialsProvider("token", personalAccessToken))
                        .setCloneAllBranches(true)
                        .call();
            }

            repository.setSyncStatus("SYNCED");
            repository.setLastSyncedAt(OffsetDateTime.now());
            log.info("Successfully synced repository: {}", repository.getFullName());

            // TODO: Trigger Phase 3 Static Analysis Engine (FastAPI Call)

        } catch (GitAPIException | IOException e) {
            log.error("Failed to clone or pull repository: {}", repository.getFullName(), e);
            repository.setSyncStatus("FAILED");
        } finally {
            gitRepositoryRepository.save(repository);
        }
    }
}
