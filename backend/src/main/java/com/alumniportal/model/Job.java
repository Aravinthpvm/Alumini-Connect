package com.alumniportal.model;

import com.alumniportal.model.enums.JobType;
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
@Document(collection = "jobs")
public class Job {

    @Id
    private String id;

    @Indexed
    private String postedBy; // Alumni ID

    private String jobTitle;
    private String company;
    private String companyLogo;
    private String location;
    private String locationType; // ONSITE, REMOTE, HYBRID
    private JobType jobType;

    private String description;
    private String requirements;
    private List<String> preferredSkills = new ArrayList<>();
    private String experienceRequired;

    private SalaryRange salaryRange;

    private LocalDateTime applicationDeadline;
    private String applicationUrl;
    private String applicationEmail;

    private int viewCount = 0;
    private int applicationCount = 0;

    private String status = "ACTIVE"; // ACTIVE, CLOSED, FILLED

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SalaryRange {
        private Double min;
        private Double max;
        private String currency = "INR";
    }
}
