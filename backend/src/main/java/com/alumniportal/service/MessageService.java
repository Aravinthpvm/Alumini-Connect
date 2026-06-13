package com.alumniportal.service;

import com.alumniportal.model.Conversation;
import com.alumniportal.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final ConversationRepository conversationRepository;

    public List<Conversation> getUserConversations(String userId) {
        return conversationRepository.findByParticipantsUserId(userId);
    }

    public Conversation getOrCreateConversation(String senderId, String senderType, String senderName,
            String senderPicture,
            String receiverId, String receiverType,
            String receiverName, String receiverPicture) {
        List<Conversation> conversations = conversationRepository.findByParticipantsUserId(senderId);
        Optional<Conversation> existing = conversations.stream()
                .filter(c -> c.getParticipants().stream()
                        .anyMatch(p -> p.getUserId().equals(receiverId)))
                .findFirst();

        if (existing.isPresent())
            return existing.get();

        Conversation conversation = new Conversation();
        conversation.getParticipants().add(
                new Conversation.Participant(senderId, senderType, senderName, senderPicture));
        conversation.getParticipants().add(
                new Conversation.Participant(receiverId, receiverType, receiverName, receiverPicture));
        return conversationRepository.save(conversation);
    }

    public Conversation sendMessage(String conversationId, String senderId, String message) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        boolean isParticipant = conversation.getParticipants().stream()
                .anyMatch(p -> p.getUserId().equals(senderId));
        if (!isParticipant)
            throw new RuntimeException("Unauthorized");

        Conversation.Message msg = new Conversation.Message(senderId, message, LocalDateTime.now(), false);
        conversation.getMessages().add(msg);
        conversation.setLastMessage(new Conversation.LastMessage(message, LocalDateTime.now(), senderId));
        conversation.setUpdatedAt(LocalDateTime.now());
        return conversationRepository.save(conversation);
    }

    public Conversation getConversationById(String conversationId, String userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        boolean isParticipant = conversation.getParticipants().stream()
                .anyMatch(p -> p.getUserId().equals(userId));
        if (!isParticipant)
            throw new RuntimeException("Unauthorized");
        return conversation;
    }
}
