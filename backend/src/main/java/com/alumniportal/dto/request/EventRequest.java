package com.alumniportal.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class EventRequest {
    private String eventTitle;
    private String description;
    private String eventType; // WEBINAR, MEETUP, WORKSHOP, etc.
    private String eventDate;
    private String startTime;
    private String endTime;
    private String mode; // ONLINE, OFFLINE
    private String venue;
    private String meetingLink;
    private Integer maxParticipants;
    private String registrationDeadline;
    private String speakerName;
    private String speakerDesignation;
    private List<String> topics;
}
