package com.shadowengineer.core.controller;

import com.shadowengineer.core.dto.AnalyticsSummaryDto;
import com.shadowengineer.core.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/repositories/{repositoryId}/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<AnalyticsSummaryDto> getAnalytics(@PathVariable UUID repositoryId) {
        return ResponseEntity.ok(analyticsService.getRepositoryAnalytics(repositoryId));
    }
}
