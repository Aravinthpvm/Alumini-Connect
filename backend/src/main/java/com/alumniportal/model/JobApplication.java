package com.alumniportal.model;

import com.alumniportal.model.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "jobApplications")
public class JobApplication {

    @Id
    private String id;

    @Indexed
    private String jobId;

    @Indexed
    private String studentId;

    private String alumniId; // Job poster

    private String resume;
    private String coverLetter;

    private ApplicationStatus status = ApplicationStatus.APPLIED;

    private String reviewNotes;
    private LocalDateTime reviewedAt;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
