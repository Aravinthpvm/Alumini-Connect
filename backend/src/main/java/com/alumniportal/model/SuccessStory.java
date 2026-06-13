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
@Document(collection = "successStories")
public class SuccessStory {

    @Id
    private String id;

    @Indexed
    private String alumniId;

    private String title;
    private String story;
    private List<String> images = new ArrayList<>();

    private Highlights highlights;
    private String advice;

    private boolean featured = false;

    private int likes = 0;
    private List<String> likedBy = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Highlights {
        private String currentRole;
        private String company;
        private String achievement;
    }
}
