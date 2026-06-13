package com.alumniportal.repository;

import com.alumniportal.model.Answer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends MongoRepository<Answer, String> {
    List<Answer> findByQuestionId(String questionId);

    List<Answer> findByQuestionIdOrderByCreatedAtAsc(String questionId);

    List<Answer> findByAnsweredBy(String userId);

    long countByQuestionId(String questionId);
}
