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
@Document(collection = "students")
public class Student {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String fullName;
    private String email;
    private String phoneNumber;
    private String profilePicture;

    // Academic Info
    private String rollNumber;
    private String branch;
    private Integer currentYear;
    private Integer graduationYear;
    private Double cgpa;

    // Career Info
    private String resume;
    private List<String> skills = new ArrayList<>();
    private List<String> interests = new ArrayList<>();
    private String careerGoals;

    // Social
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String bio;

    // Connections
    private List<String> mentors = new ArrayList<>();
    private List<String> connections = new ArrayList<>();

    private boolean isActive = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
