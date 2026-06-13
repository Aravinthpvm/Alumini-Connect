package com.alumniportal.repository;

import com.alumniportal.model.SuccessStory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuccessStoryRepository extends MongoRepository<SuccessStory, String> {
    List<SuccessStory> findByAlumniId(String alumniId);

    List<SuccessStory> findByFeaturedOrderByCreatedAtDesc(boolean featured);

    List<SuccessStory> findAllByOrderByCreatedAtDesc();
}
