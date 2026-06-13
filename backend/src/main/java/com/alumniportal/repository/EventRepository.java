package com.alumniportal.repository;

import com.alumniportal.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByStatus(String status);

    List<Event> findByOrganizer(String organizerId);

    List<Event> findByStatusOrderByEventDateAsc(String status);

    List<Event> findByRegisteredStudentsContaining(String studentId);

    List<Event> findByRegisteredAlumniContaining(String alumniId);

    long countByStatus(String status);
}
