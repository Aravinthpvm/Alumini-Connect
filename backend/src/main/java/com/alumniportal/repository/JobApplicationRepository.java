package com.alumniportal.repository;

import com.alumniportal.model.JobApplication;
import com.alumniportal.model.enums.ApplicationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends MongoRepository<JobApplication, String> {
    List<JobApplication> findByJobId(String jobId);

    List<JobApplication> findByStudentId(String studentId);

    List<JobApplication> findByAlumniId(String alumniId);

    List<JobApplication> findByAlumniIdAndStatus(String alumniId, ApplicationStatus status);

    Optional<JobApplication> findByJobIdAndStudentId(String jobId, String studentId);

    boolean existsByJobIdAndStudentId(String jobId, String studentId);

    long countByJobId(String jobId);
}
