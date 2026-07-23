package com.shadowengineer.core.service;

import com.shadowengineer.core.dto.AnalyticsSummaryDto;
import com.shadowengineer.core.repository.AnalyticsEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsEventRepository analyticsEventRepository;

    public AnalyticsSummaryDto getRepositoryAnalytics(UUID repositoryId) {
        long prReviews = analyticsEventRepository.countByRepositoryAndEventType(repositoryId, "PR_REVIEW");
        long docsGenerated = analyticsEventRepository.countByRepositoryAndEventType(repositoryId, "DOC_GENERATION");
        long testsGenerated = analyticsEventRepository.countByRepositoryAndEventType(repositoryId, "TEST_GENERATION");
        Long tokens = analyticsEventRepository.sumTokenUsageByRepository(repositoryId);

        // Simple health score algorithm based on engagement for prototype
        int healthScore = (int) Math.min(100, 50 + (prReviews * 2) + (docsGenerated * 5) + (testsGenerated * 5));

        return AnalyticsSummaryDto.builder()
                .totalPrReviews(prReviews)
                .totalDocsGenerated(docsGenerated)
                .totalTestsGenerated(testsGenerated)
                .tokensConsumed(tokens == null ? 0 : tokens)
                .repositoryHealthScore(healthScore)
                .build();
    }
}
