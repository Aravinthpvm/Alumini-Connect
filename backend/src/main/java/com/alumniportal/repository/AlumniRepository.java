package com.alumniportal.repository;

import com.alumniportal.model.Alumni;
import com.alumniportal.model.enums.VerificationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlumniRepository extends MongoRepository<Alumni, String> {
    Optional<Alumni> findByUserId(String userId);

    Optional<Alumni> findByEmail(String email);

    List<Alumni> findByVerificationStatus(VerificationStatus status);

    List<Alumni> findByAvailableForMentorship(boolean available);

    List<Alumni> findByCurrentCompanyContainingIgnoreCase(String company);

    List<Alumni> findByGraduationYear(Integer year);

    List<Alumni> findByIndustry(String industry);

    boolean existsByUserId(String userId);

    long countByVerificationStatus(VerificationStatus status);
}
