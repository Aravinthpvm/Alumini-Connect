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
@Document(collection = "answers")
public class Answer {

    @Id
    private String id;

    @Indexed
    private String questionId;

    @Indexed
    private String answeredBy;
    private String answererType; // STUDENT, ALUMNI

    private String content;

    private int upvotes = 0;
    private List<String> upvotedBy = new ArrayList<>();

    private boolean isBestAnswer = false;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
