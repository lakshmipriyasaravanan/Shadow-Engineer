package com.shadowengineer.core.repository;

import com.shadowengineer.core.domain.AnalyticsEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEvent, UUID> {
    
    @Query("SELECT COUNT(e) FROM AnalyticsEvent e WHERE e.repository.id = :repoId AND e.eventType = :eventType")
    long countByRepositoryAndEventType(@Param("repoId") UUID repoId, @Param("eventType") String eventType);

    @Query("SELECT SUM(e.tokenUsage) FROM AnalyticsEvent e WHERE e.repository.id = :repoId")
    Long sumTokenUsageByRepository(@Param("repoId") UUID repoId);

    @Query("SELECT COUNT(e) FROM AnalyticsEvent e")
    long countTotalEvents();
}
