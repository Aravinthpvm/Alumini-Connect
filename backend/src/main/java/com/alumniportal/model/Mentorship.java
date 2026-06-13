package com.alumniportal.model;

import com.alumniportal.model.enums.MentorshipStatus;
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
@Document(collection = "mentorships")
public class Mentorship {

    @Id
    private String id;

    @Indexed
    private String studentId;

    @Indexed
    private String alumniId;

    private String requestMessage;
    private List<String> areasOfInterest = new ArrayList<>();

    private MentorshipStatus status = MentorshipStatus.PENDING;

    private String responseMessage;
    private LocalDateTime respondedAt;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private List<Session> sessions = new ArrayList<>();
    private Feedback studentFeedback;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Session {
        private LocalDateTime date;
        private Integer duration; // minutes
        private String notes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Feedback {
        private Integer rating;
        private String review;
        private LocalDateTime submittedAt;
    }
}
