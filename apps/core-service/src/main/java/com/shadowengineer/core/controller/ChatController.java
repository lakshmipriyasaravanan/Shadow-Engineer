package com.shadowengineer.core.controller;

import com.shadowengineer.core.domain.Conversation;
import com.shadowengineer.core.domain.Message;
import com.shadowengineer.core.domain.User;
import com.shadowengineer.core.dto.ChatRequest;
import com.shadowengineer.core.service.ChatService;
import com.shadowengineer.core.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/repositories/{repositoryId}/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    @GetMapping("/conversations")
    public ResponseEntity<List<Conversation>> getConversations(
            Authentication authentication,
            @PathVariable UUID repositoryId
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(chatService.getConversations(user, repositoryId));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable UUID conversationId) {
        return ResponseEntity.ok(chatService.getMessages(conversationId));
    }

    @PostMapping("/messages")
    public ResponseEntity<Conversation> saveMessage(
            Authentication authentication,
            @PathVariable UUID repositoryId,
            @Valid @RequestBody ChatRequest request
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(chatService.saveMessage(user, repositoryId, request));
    }
}
