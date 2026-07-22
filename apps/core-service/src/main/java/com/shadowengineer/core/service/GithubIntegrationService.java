package com.shadowengineer.core.service;

import com.shadowengineer.core.domain.GitRepository;
import com.shadowengineer.core.domain.Organization;
import com.shadowengineer.core.repository.GitRepositoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GitHub;
import org.kohsuke.github.GitHubBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GithubIntegrationService {

    private final GitRepositoryRepository gitRepositoryRepository;

    public boolean testConnection(String personalAccessToken) {
        try {
            GitHub github = new GitHubBuilder().withOAuthToken(personalAccessToken).build();
            github.checkApiUrlValidity();
            return true;
        } catch (IOException e) {
            log.error("Failed to connect to GitHub", e);
            return false;
        }
    }

    @Transactional
    public List<GitRepository> importRepositories(String personalAccessToken, Organization organization) throws IOException {
        GitHub github = new GitHubBuilder().withOAuthToken(personalAccessToken).build();
        Map<String, GHRepository> ghRepositories = github.getMyself().getAllRepositories();
        
        List<GitRepository> importedRepos = new ArrayList<>();
        
        for (GHRepository ghRepo : ghRepositories.values()) {
            GitRepository repo = gitRepositoryRepository.findByGithubId(ghRepo.getId())
                    .orElseGet(GitRepository::new);
            
            repo.setOrganization(organization);
            repo.setGithubId(ghRepo.getId());
            repo.setName(ghRepo.getName());
            repo.setFullName(ghRepo.getFullName());
            repo.setDescription(ghRepo.getDescription());
            repo.setUrl(ghRepo.getHtmlUrl().toString());
            repo.setCloneUrl(ghRepo.getHttpTransportUrl());
            repo.setDefaultBranch(ghRepo.getDefaultBranch());
            repo.setPrivate(ghRepo.isPrivate());
            repo.setLanguage(ghRepo.getLanguage());
            
            if (repo.getSyncStatus() == null) {
                repo.setSyncStatus("PENDING");
            }
            
            importedRepos.add(gitRepositoryRepository.save(repo));
        }
        
        return importedRepos;
    }
}
