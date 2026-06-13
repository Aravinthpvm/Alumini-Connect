package com.alumniportal.repository;

import com.alumniportal.model.Question;
import com.alumniportal.model.enums.QuestionCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByCategory(QuestionCategory category);

    List<Question> findByAskedBy(String userId);

    List<Question> findByTagsContaining(String tag);

    List<Question> findAllByOrderByCreatedAtDesc();

    List<Question> findByCategoryOrderByCreatedAtDesc(QuestionCategory category);

    long countByIsSolved(boolean isSolved);
}
