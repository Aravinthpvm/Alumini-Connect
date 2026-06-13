package com.alumniportal.model;

import com.alumniportal.model.enums.EventType;
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
@Document(collection = "events")
public class Event {

    @Id
    private String id;

    @Indexed
    private String organizer;
    private String organizerType; // ALUMNI, ADMIN

    private String eventTitle;
    private String description;
    private EventType eventType;

    private LocalDateTime eventDate;
    private String startTime;
    private String endTime;

    private String mode; // ONLINE, OFFLINE
    private String venue;
    private String meetingLink;

    private Integer maxParticipants;
    private LocalDateTime registrationDeadline;
    private List<String> registeredStudents = new ArrayList<>();
    private List<String> registeredAlumni = new ArrayList<>();
    private int currentCount = 0;

    private String bannerImage;
    private String speakerName;
    private String speakerDesignation;
    private List<String> topics = new ArrayList<>();

    private String status = "UPCOMING"; // UPCOMING, ONGOING, COMPLETED, CANCELLED

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
