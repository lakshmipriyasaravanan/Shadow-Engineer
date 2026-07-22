package com.shadowengineer.core.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GithubConnectRequest {
    @NotBlank(message = "Personal Access Token is required")
    private String personalAccessToken;
}
