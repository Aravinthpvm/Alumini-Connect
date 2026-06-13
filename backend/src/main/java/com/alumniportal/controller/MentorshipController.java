package com.alumniportal.controller;

import com.alumniportal.dto.request.MentorshipRequest;
import com.alumniportal.dto.response.ApiResponse;
import com.alumniportal.model.Mentorship;
import com.alumniportal.service.MentorshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mentorship")
@RequiredArgsConstructor
public class MentorshipController {

    private final MentorshipService mentorshipService;

    @PostMapping("/request")
    public ResponseEntity<ApiResponse<Mentorship>> requestMentorship(
            @RequestParam String studentId,
            @RequestBody MentorshipRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Request sent",
                mentorshipService.requestMentorship(studentId, request)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<Mentorship>>> getStudentMentorships(
            @PathVariable String studentId) {
        return ResponseEntity.ok(ApiResponse.success(mentorshipService.getStudentMentorships(studentId)));
    }

    @GetMapping("/alumni/{alumniId}")
    public ResponseEntity<ApiResponse<List<Mentorship>>> getAlumniMentorships(
            @PathVariable String alumniId) {
        return ResponseEntity.ok(ApiResponse.success(mentorshipService.getAlumniMentorships(alumniId)));
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<Mentorship>> acceptMentorship(
            @PathVariable String id,
            @RequestParam String alumniId,
            @RequestBody(required = false) Map<String, String> body) {
        String responseMessage = body != null ? body.get("responseMessage") : "";
        return ResponseEntity.ok(ApiResponse.success("Mentorship accepted",
                mentorshipService.acceptMentorship(id, alumniId, responseMessage)));
    }

    @PatchMapping("/{id}/decline")
    public ResponseEntity<ApiResponse<Mentorship>> declineMentorship(
            @PathVariable String id,
            @RequestParam String alumniId,
            @RequestBody(required = false) Map<String, String> body) {
        String responseMessage = body != null ? body.get("responseMessage") : "";
        return ResponseEntity.ok(ApiResponse.success("Mentorship declined",
                mentorshipService.declineMentorship(id, alumniId, responseMessage)));
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<ApiResponse<Mentorship>> submitFeedback(
            @PathVariable String id,
            @RequestParam String studentId,
            @RequestBody Map<String, Object> body) {
        Integer rating = (Integer) body.get("rating");
        String review = (String) body.get("review");
        return ResponseEntity.ok(ApiResponse.success("Feedback submitted",
                mentorshipService.submitFeedback(id, studentId, rating, review)));
    }
}
