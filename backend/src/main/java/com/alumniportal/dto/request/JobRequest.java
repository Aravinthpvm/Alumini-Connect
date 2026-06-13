package com.alumniportal.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class JobRequest {
    private String jobTitle;
    private String company;
    private String location;
    private String locationType; // ONSITE, REMOTE, HYBRID
    private String jobType; // FULL_TIME, INTERNSHIP, CONTRACT
    private String description;
    private String requirements;
    private List<String> preferredSkills;
    private String experienceRequired;
    private Double salaryMin;
    private Double salaryMax;
    private String applicationDeadline;
    private String applicationUrl;
    private String applicationEmail;
}
