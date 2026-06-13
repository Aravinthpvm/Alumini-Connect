package com.alumniportal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;

    private List<Participant> participants = new ArrayList<>();
    private List<Message> messages = new ArrayList<>();
    private LastMessage lastMessage;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Participant {
        @Indexed
        private String userId;
        private String userType; // STUDENT, ALUMNI, ADMIN
        private String name;
        private String profilePicture;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private String senderId;
        private String message;
        private LocalDateTime timestamp;
        private boolean isRead = false;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LastMessage {
        private String message;
        private LocalDateTime timestamp;
        private String senderId;
    }
}
