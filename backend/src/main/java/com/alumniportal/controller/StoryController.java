package com.alumniportal.controller;

import com.alumniportal.dto.request.SuccessStoryRequest;
import com.alumniportal.dto.response.ApiResponse;
import com.alumniportal.model.SuccessStory;
import com.alumniportal.service.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SuccessStory>>> getAllStories() {
        return ResponseEntity.ok(ApiResponse.success(storyService.getAllStories()));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<SuccessStory>>> getFeaturedStories() {
        return ResponseEntity.ok(ApiResponse.success(storyService.getFeaturedStories()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SuccessStory>> createStory(
            @RequestParam String alumniId,
            @RequestBody SuccessStoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Story created", storyService.createStory(alumniId, request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SuccessStory>> getStoryById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(storyService.getStoryById(id)));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<SuccessStory>> likeStory(
            @PathVariable String id, @RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success("Liked", storyService.likeStory(id, userId)));
    }

    @PatchMapping("/{id}/toggle-featured")
    public ResponseEntity<ApiResponse<SuccessStory>> toggleFeatured(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Updated", storyService.toggleFeatured(id)));
    }

    @GetMapping("/alumni/{alumniId}")
    public ResponseEntity<ApiResponse<List<SuccessStory>>> getAlumniStories(@PathVariable String alumniId) {
        return ResponseEntity.ok(ApiResponse.success(storyService.getAlumniStories(alumniId)));
    }
}
