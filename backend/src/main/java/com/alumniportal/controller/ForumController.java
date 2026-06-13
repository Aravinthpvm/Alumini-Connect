package com.alumniportal.controller;

import com.alumniportal.dto.request.AnswerRequest;
import com.alumniportal.dto.request.QuestionRequest;
import com.alumniportal.dto.response.ApiResponse;
import com.alumniportal.model.Answer;
import com.alumniportal.model.Question;
import com.alumniportal.service.ForumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;

    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<List<Question>>> getAllQuestions(
            @RequestParam(required = false) String category) {
        if (category != null) {
            return ResponseEntity.ok(ApiResponse.success(forumService.getQuestionsByCategory(category)));
        }
        return ResponseEntity.ok(ApiResponse.success(forumService.getAllQuestions()));
    }

    @PostMapping("/questions")
    public ResponseEntity<ApiResponse<Question>> createQuestion(
            @RequestParam String userId,
            @RequestParam String userType,
            @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Question posted",
                forumService.createQuestion(userId, userType, request)));
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<ApiResponse<Question>> getQuestionById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(forumService.getQuestionById(id)));
    }

    @PostMapping("/questions/{questionId}/answer")
    public ResponseEntity<ApiResponse<Answer>> addAnswer(
            @PathVariable String questionId,
            @RequestParam String userId,
            @RequestParam String userType,
            @RequestBody AnswerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Answer posted",
                forumService.addAnswer(questionId, userId, userType, request)));
    }

    @GetMapping("/questions/{questionId}/answers")
    public ResponseEntity<ApiResponse<List<Answer>>> getAnswers(@PathVariable String questionId) {
        return ResponseEntity.ok(ApiResponse.success(forumService.getAnswersByQuestion(questionId)));
    }

    @PostMapping("/answers/{answerId}/upvote")
    public ResponseEntity<ApiResponse<Answer>> upvoteAnswer(
            @PathVariable String answerId, @RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success("Upvoted", forumService.upvoteAnswer(answerId, userId)));
    }

    @PatchMapping("/questions/{questionId}/best-answer")
    public ResponseEntity<ApiResponse<Question>> markBestAnswer(
            @PathVariable String questionId,
            @RequestParam String answerId,
            @RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success("Best answer marked",
                forumService.markBestAnswer(questionId, answerId, userId)));
    }

    @GetMapping("/questions/user/{userId}")
    public ResponseEntity<ApiResponse<List<Question>>> getUserQuestions(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(forumService.getUserQuestions(userId)));
    }
}
