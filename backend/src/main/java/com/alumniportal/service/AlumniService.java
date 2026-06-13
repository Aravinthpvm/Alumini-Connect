package com.alumniportal.service;

import com.alumniportal.model.Alumni;
import com.alumniportal.model.enums.VerificationStatus;
import com.alumniportal.repository.AlumniRepository;
import com.alumniportal.repository.MentorshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlumniService {

    private final AlumniRepository alumniRepository;
    private final MongoTemplate mongoTemplate;

    public Alumni getAlumniById(String id) {
        return alumniRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumni not found with id: " + id));
    }

    public Alumni getAlumniByUserId(String userId) {
        return alumniRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Alumni profile not found"));
    }

    public Alumni updateAlumni(String id, Alumni updates) {
        Alumni existing = getAlumniById(id);
        if (updates.getBio() != null)
            existing.setBio(updates.getBio());
        if (updates.getCurrentCompany() != null)
            existing.setCurrentCompany(updates.getCurrentCompany());
        if (updates.getCurrentPosition() != null)
            existing.setCurrentPosition(updates.getCurrentPosition());
        if (updates.getIndustry() != null)
            existing.setIndustry(updates.getIndustry());
        if (updates.getLocation() != null)
            existing.setLocation(updates.getLocation());
        if (updates.getSkills() != null)
            existing.setSkills(updates.getSkills());
        if (updates.getDomains() != null)
            existing.setDomains(updates.getDomains());
        if (updates.getMentorshipAreas() != null)
            existing.setMentorshipAreas(updates.getMentorshipAreas());
        if (updates.getLinkedinUrl() != null)
            existing.setLinkedinUrl(updates.getLinkedinUrl());
        if (updates.getGithubUrl() != null)
            existing.setGithubUrl(updates.getGithubUrl());
        if (updates.getPersonalWebsite() != null)
            existing.setPersonalWebsite(updates.getPersonalWebsite());
        if (updates.getAchievements() != null)
            existing.setAchievements(updates.getAchievements());
        if (updates.getWorkHistory() != null)
            existing.setWorkHistory(updates.getWorkHistory());
        existing.setAvailableForMentorship(updates.isAvailableForMentorship());
        existing.setWillingToHire(updates.isWillingToHire());
        existing.setCanSpeakAtEvents(updates.isCanSpeakAtEvents());
        if (updates.getMaxMentees() != null)
            existing.setMaxMentees(updates.getMaxMentees());
        existing.setUpdatedAt(java.time.LocalDateTime.now());
        return alumniRepository.save(existing);
    }

    public List<Alumni> getAlumniDirectory() {
        return alumniRepository.findByVerificationStatus(VerificationStatus.VERIFIED);
    }

    public List<Alumni> searchAlumni(String name, String company, String domain,
            Integer graduationYear, Boolean availableForMentorship,
            String industry, String location) {
        Query query = new Query();
        query.addCriteria(Criteria.where("verificationStatus").is(VerificationStatus.VERIFIED));

        if (name != null && !name.isBlank()) {
            query.addCriteria(Criteria.where("fullName").regex(name, "i"));
        }
        if (company != null && !company.isBlank()) {
            query.addCriteria(Criteria.where("currentCompany").regex(company, "i"));
        }
        if (domain != null && !domain.isBlank()) {
            query.addCriteria(Criteria.where("domains").in(domain));
        }
        if (graduationYear != null) {
            query.addCriteria(Criteria.where("graduationYear").is(graduationYear));
        }
        if (Boolean.TRUE.equals(availableForMentorship)) {
            query.addCriteria(Criteria.where("availableForMentorship").is(true));
        }
        if (industry != null && !industry.isBlank()) {
            query.addCriteria(Criteria.where("industry").regex(industry, "i"));
        }
        if (location != null && !location.isBlank()) {
            query.addCriteria(Criteria.where("location").regex(location, "i"));
        }

        return mongoTemplate.find(query, Alumni.class);
    }

    public Alumni verifyAlumni(String id, String status, String verifiedBy) {
        Alumni alumni = getAlumniById(id);
        alumni.setVerificationStatus(VerificationStatus.valueOf(status));
        alumni.setVerifiedAt(java.time.LocalDateTime.now());
        alumni.setVerifiedBy(verifiedBy);
        alumni.setUpdatedAt(java.time.LocalDateTime.now());
        return alumniRepository.save(alumni);
    }

    public List<Alumni> getPendingVerifications() {
        return alumniRepository.findByVerificationStatus(VerificationStatus.PENDING);
    }

    public Alumni updateProfilePicture(String alumniId, String pictureUrl) {
        Alumni alumni = getAlumniById(alumniId);
        alumni.setProfilePicture(pictureUrl);
        alumni.setUpdatedAt(java.time.LocalDateTime.now());
        return alumniRepository.save(alumni);
    }
}
