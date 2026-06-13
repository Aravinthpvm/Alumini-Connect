package com.alumniportal.repository;

import com.alumniportal.model.Mentorship;
import com.alumniportal.model.enums.MentorshipStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorshipRepository extends MongoRepository<Mentorship, String> {
    List<Mentorship> findByStudentId(String studentId);

    List<Mentorship> findByAlumniId(String alumniId);

    List<Mentorship> findByStudentIdAndStatus(String studentId, MentorshipStatus status);

    List<Mentorship> findByAlumniIdAndStatus(String alumniId, MentorshipStatus status);

    boolean existsByStudentIdAndAlumniIdAndStatus(String studentId, String alumniId, MentorshipStatus status);

    long countByStatus(MentorshipStatus status);
}
