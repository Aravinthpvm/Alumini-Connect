package com.alumniportal.dto.request;

import lombok.Data;

@Data
public class SuccessStoryRequest {
    private String title;
    private String story;
    private String currentRole;
    private String company;
    private String achievement;
    private String advice;
    private boolean featured;
}
