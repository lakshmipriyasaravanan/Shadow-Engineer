package com.shadowengineer.core.repository;

import com.shadowengineer.core.domain.GitRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GitRepositoryRepository extends JpaRepository<GitRepository, UUID> {
    List<GitRepository> findByOrganizationId(UUID organizationId);
    Optional<GitRepository> findByGithubId(Long githubId);
}
