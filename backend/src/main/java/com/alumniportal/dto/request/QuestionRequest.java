package com.alumniportal.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class QuestionRequest {
    private String title;
    private String description;
    private String category;
    private List<String> tags;
}
