package com.shadowengineer.core.service;

import com.shadowengineer.core.domain.Organization;
import com.shadowengineer.core.dto.OrganizationRequest;
import com.shadowengineer.core.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public Organization createOrganization(OrganizationRequest request) {
        if (organizationRepository.existsBySlug(request.getSlug())) {
            throw new IllegalArgumentException("Slug is already taken");
        }

        Organization org = Organization.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .build();
        
        return organizationRepository.save(org);
    }
}
