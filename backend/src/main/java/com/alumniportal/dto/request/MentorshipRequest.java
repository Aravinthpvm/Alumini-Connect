package com.alumniportal.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class MentorshipRequest {
    private String alumniId;
    private String requestMessage;
    private List<String> areasOfInterest;
}
