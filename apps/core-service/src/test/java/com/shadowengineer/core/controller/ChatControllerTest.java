package com.shadowengineer.core.controller;

import com.shadowengineer.core.domain.Conversation;
import com.shadowengineer.core.domain.User;
import com.shadowengineer.core.service.ChatService;
import com.shadowengineer.core.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ChatControllerTest {

    @Mock
    private ChatService chatService;

    @Mock
    private UserService userService;

    @InjectMocks
    private ChatController chatController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetConversations() {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("test@example.com");
        
        User mockUser = new User();
        when(userService.getUserByEmail("test@example.com")).thenReturn(mockUser);
        
        UUID repoId = UUID.randomUUID();
        when(chatService.getConversations(mockUser, repoId)).thenReturn(Collections.emptyList());

        ResponseEntity<List<Conversation>> response = chatController.getConversations(auth, repoId);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(0, response.getBody().size());
    }
}
