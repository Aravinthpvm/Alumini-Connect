package com.alumniportal.service;

import com.alumniportal.model.Student;
import com.alumniportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public Student getStudentById(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public Student getStudentByUserId(String userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
    }

    public Student updateStudent(String id, Student updates) {
        Student existing = getStudentById(id);
        if (updates.getBio() != null)
            existing.setBio(updates.getBio());
        if (updates.getSkills() != null)
            existing.setSkills(updates.getSkills());
        if (updates.getInterests() != null)
            existing.setInterests(updates.getInterests());
        if (updates.getCareerGoals() != null)
            existing.setCareerGoals(updates.getCareerGoals());
        if (updates.getLinkedinUrl() != null)
            existing.setLinkedinUrl(updates.getLinkedinUrl());
        if (updates.getGithubUrl() != null)
            existing.setGithubUrl(updates.getGithubUrl());
        if (updates.getPortfolioUrl() != null)
            existing.setPortfolioUrl(updates.getPortfolioUrl());
        if (updates.getCgpa() != null)
            existing.setCgpa(updates.getCgpa());
        if (updates.getCurrentYear() != null)
            existing.setCurrentYear(updates.getCurrentYear());
        if (updates.getPhoneNumber() != null)
            existing.setPhoneNumber(updates.getPhoneNumber());
        existing.setUpdatedAt(java.time.LocalDateTime.now());
        return studentRepository.save(existing);
    }

    public Student updateResume(String studentId, String resumeUrl) {
        Student student = getStudentById(studentId);
        student.setResume(resumeUrl);
        student.setUpdatedAt(java.time.LocalDateTime.now());
        return studentRepository.save(student);
    }

    public Student updateProfilePicture(String studentId, String pictureUrl) {
        Student student = getStudentById(studentId);
        student.setProfilePicture(pictureUrl);
        student.setUpdatedAt(java.time.LocalDateTime.now());
        return studentRepository.save(student);
    }
}
