package com.shadowengineer.core.controller;

import com.shadowengineer.core.domain.GitRepository;
import com.shadowengineer.core.domain.Organization;
import com.shadowengineer.core.dto.GithubConnectRequest;
import com.shadowengineer.core.repository.OrganizationRepository;
import com.shadowengineer.core.service.GithubIntegrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/github")
@RequiredArgsConstructor
public class GithubController {

    private final GithubIntegrationService githubService;
    private final OrganizationRepository organizationRepository;

    @PostMapping("/test-connection")
    public ResponseEntity<Boolean> testConnection(@Valid @RequestBody GithubConnectRequest request) {
        boolean isValid = githubService.testConnection(request.getPersonalAccessToken());
        if (isValid) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.badRequest().body(false);
        }
    }

    @PostMapping("/import/{organizationId}")
    public ResponseEntity<List<GitRepository>> importRepositories(
            @PathVariable UUID organizationId,
            @Valid @RequestBody GithubConnectRequest request
    ) throws Exception {
        Organization org = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));
        
        List<GitRepository> repos = githubService.importRepositories(request.getPersonalAccessToken(), org);
        return ResponseEntity.ok(repos);
    }
}
