package com.alumniportal.repository;

import com.alumniportal.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    List<Conversation> findByParticipantsUserId(String userId);

    Optional<Conversation> findByParticipantsUserIdContaining(String userId);
}
