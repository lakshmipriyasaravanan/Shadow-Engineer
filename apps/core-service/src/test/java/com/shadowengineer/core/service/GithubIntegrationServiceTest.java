package com.shadowengineer.core.service;

import com.shadowengineer.core.repository.GitRepositoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertFalse;

class GithubIntegrationServiceTest {

    @Mock
    private GitRepositoryRepository gitRepositoryRepository;

    @InjectMocks
    private GithubIntegrationService githubIntegrationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testConnection_InvalidToken() {
        boolean isValid = githubIntegrationService.testConnection("invalid_token");
        assertFalse(isValid, "Invalid token should return false");
    }
}
