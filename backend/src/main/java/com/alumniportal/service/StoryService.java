package com.alumniportal.service;

import com.alumniportal.dto.request.SuccessStoryRequest;
import com.alumniportal.model.SuccessStory;
import com.alumniportal.repository.SuccessStoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final SuccessStoryRepository storyRepository;

    public SuccessStory createStory(String alumniId, SuccessStoryRequest request) {
        SuccessStory story = new SuccessStory();
        story.setAlumniId(alumniId);
        story.setTitle(request.getTitle());
        story.setStory(request.getStory());
        story.setAdvice(request.getAdvice());
        story.setFeatured(request.isFeatured());
        story.setHighlights(new SuccessStory.Highlights(
                request.getCurrentRole(), request.getCompany(), request.getAchievement()));
        return storyRepository.save(story);
    }

    public List<SuccessStory> getAllStories() {
        return storyRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<SuccessStory> getFeaturedStories() {
        return storyRepository.findByFeaturedOrderByCreatedAtDesc(true);
    }

    public SuccessStory getStoryById(String id) {
        return storyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Story not found"));
    }

    public SuccessStory likeStory(String storyId, String userId) {
        SuccessStory story = getStoryById(storyId);
        if (!story.getLikedBy().contains(userId)) {
            story.getLikedBy().add(userId);
            story.setLikes(story.getLikes() + 1);
        }
        return storyRepository.save(story);
    }

    public SuccessStory toggleFeatured(String storyId) {
        SuccessStory story = getStoryById(storyId);
        story.setFeatured(!story.isFeatured());
        story.setUpdatedAt(LocalDateTime.now());
        return storyRepository.save(story);
    }

    public List<SuccessStory> getAlumniStories(String alumniId) {
        return storyRepository.findByAlumniId(alumniId);
    }
}
