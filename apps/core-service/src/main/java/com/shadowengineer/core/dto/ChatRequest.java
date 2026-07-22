package com.shadowengineer.core.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatRequest {
    private UUID conversationId; // Null if starting a new conversation
    
    @NotBlank
    private String title;
    
    @NotBlank
    private String role; // 'user' or 'assistant'
    
    @NotBlank
    private String content;
}
