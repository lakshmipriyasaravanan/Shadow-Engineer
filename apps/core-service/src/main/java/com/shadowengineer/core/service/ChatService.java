package com.shadowengineer.core.service;

import com.shadowengineer.core.domain.Conversation;
import com.shadowengineer.core.domain.GitRepository;
import com.shadowengineer.core.domain.Message;
import com.shadowengineer.core.domain.User;
import com.shadowengineer.core.dto.ChatRequest;
import com.shadowengineer.core.repository.ConversationRepository;
import com.shadowengineer.core.repository.GitRepositoryRepository;
import com.shadowengineer.core.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final GitRepositoryRepository gitRepositoryRepository;

    public List<Conversation> getConversations(User user, UUID repositoryId) {
        return conversationRepository.findByUserIdAndRepositoryIdOrderByUpdatedAtDesc(user.getId(), repositoryId);
    }

    public List<Message> getMessages(UUID conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    @Transactional
    public Conversation saveMessage(User user, UUID repositoryId, ChatRequest request) {
        Conversation conversation;

        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
            conversation.setUpdatedAt(OffsetDateTime.now());
        } else {
            GitRepository repo = gitRepositoryRepository.findById(repositoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Repository not found"));

            conversation = Conversation.builder()
                    .user(user)
                    .repository(repo)
                    .title(request.getTitle())
                    .build();
            conversation = conversationRepository.save(conversation);
        }

        Message message = Message.builder()
                .conversation(conversation)
                .role(request.getRole())
                .content(request.getContent())
                .build();
        
        messageRepository.save(message);
        
        return conversationRepository.save(conversation);
    }
}
