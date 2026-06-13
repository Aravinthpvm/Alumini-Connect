package com.alumniportal.model;

import com.alumniportal.model.enums.QuestionCategory;
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
@Document(collection = "questions")
public class Question {

    @Id
    private String id;

    @Indexed
    private String askedBy;
    private String askerType; // STUDENT, ALUMNI

    private String title;
    private String description;
    private QuestionCategory category;
    private List<String> tags = new ArrayList<>();

    private int answers = 0;
    private int views = 0;
    private int upvotes = 0;

    private boolean isSolved = false;
    private String bestAnswerId;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
