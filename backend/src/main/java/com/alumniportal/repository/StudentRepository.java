package com.alumniportal.repository;

import com.alumniportal.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByUserId(String userId);

    Optional<Student> findByEmail(String email);

    List<Student> findByBranch(String branch);

    List<Student> findByGraduationYear(Integer year);

    boolean existsByUserId(String userId);
}
