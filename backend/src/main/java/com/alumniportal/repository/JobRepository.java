package com.alumniportal.repository;

import com.alumniportal.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByStatus(String status);

    List<Job> findByPostedBy(String alumniId);

    List<Job> findByStatusOrderByCreatedAtDesc(String status);

    List<Job> findByCompanyContainingIgnoreCase(String company);

    List<Job> findByJobType(String jobType);

    List<Job> findByLocationContainingIgnoreCase(String location);

    long countByStatus(String status);
}
