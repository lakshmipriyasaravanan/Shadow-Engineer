package com.shadowengineer.core.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnalyticsSummaryDto {
    private long totalPrReviews;
    private long totalDocsGenerated;
    private long totalTestsGenerated;
    private long tokensConsumed;
    private int repositoryHealthScore;
}
