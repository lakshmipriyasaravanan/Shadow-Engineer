package com.shadowengineer.core.controller;

import com.shadowengineer.core.domain.AuditLog;
import com.shadowengineer.core.repository.AnalyticsEventRepository;
import com.shadowengineer.core.repository.AuditLogRepository;
import com.shadowengineer.core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuditLogRepository auditLogRepository;
    private final AnalyticsEventRepository analyticsEventRepository;
    private final UserRepository userRepository;

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        // In a real app this would be paginated and secured by @PreAuthorize("hasRole('ADMIN')")
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalAiEvents", analyticsEventRepository.countTotalEvents());
        return ResponseEntity.ok(stats);
    }
}
