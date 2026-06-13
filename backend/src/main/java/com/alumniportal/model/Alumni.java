package com.alumniportal.model;

import com.alumniportal.model.enums.VerificationStatus;
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
@Document(collection = "alumni")
public class Alumni {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String fullName;
    private String email;
    private String phoneNumber;
    private String profilePicture;

    // Academic
    private String rollNumber;
    private String branch;
    private Integer graduationYear;

    // Professional
    private String currentCompany;
    private String currentPosition;
    private Integer yearsOfExperience;
    private String industry;
    private String location;

    private List<WorkHistory> workHistory = new ArrayList<>();

    // Expertise
    private List<String> skills = new ArrayList<>();
    private List<String> domains = new ArrayList<>();

    // Mentorship
    private boolean availableForMentorship = false;
    private List<String> mentorshipAreas = new ArrayList<>();
    private Integer maxMentees = 3;
    private List<String> currentMentees = new ArrayList<>();

    // Engagement
    private boolean willingToHire = false;
    private boolean canSpeakAtEvents = false;

    // Verification
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;
    private String verificationDocument;
    private LocalDateTime verifiedAt;
    private String verifiedBy;

    // Social
    private String linkedinUrl;
    private String githubUrl;
    private String personalWebsite;
    private String bio;
    private String achievements;

    // Connections
    private List<String> mentees = new ArrayList<>();
    private List<String> connections = new ArrayList<>();

    private boolean isActive = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkHistory {
        private String company;
        private String position;
        private String startDate;
        private String endDate;
        private String description;
    }
}
