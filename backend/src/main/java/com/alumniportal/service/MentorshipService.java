package com.alumniportal.service;

import com.alumniportal.dto.request.MentorshipRequest;
import com.alumniportal.model.Alumni;
import com.alumniportal.model.Mentorship;
import com.alumniportal.model.Student;
import com.alumniportal.model.enums.MentorshipStatus;
import com.alumniportal.repository.AlumniRepository;
import com.alumniportal.repository.MentorshipRepository;
import com.alumniportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorshipService {

    private final MentorshipRepository mentorshipRepository;
    private final StudentRepository studentRepository;
    private final AlumniRepository alumniRepository;

    public Mentorship requestMentorship(String studentId, MentorshipRequest request) {
        Alumni alumni = alumniRepository.findById(request.getAlumniId())
                .orElseThrow(() -> new RuntimeException("Alumni not found"));

        if (!alumni.isAvailableForMentorship()) {
            throw new RuntimeException("Alumni is not available for mentorship");
        }

        boolean exists = mentorshipRepository.existsByStudentIdAndAlumniIdAndStatus(
                studentId, request.getAlumniId(), MentorshipStatus.PENDING);
        if (exists) {
            throw new RuntimeException("Mentorship request already pending");
        }

        Mentorship mentorship = new Mentorship();
        mentorship.setStudentId(studentId);
        mentorship.setAlumniId(request.getAlumniId());
        mentorship.setRequestMessage(request.getRequestMessage());
        mentorship.setAreasOfInterest(request.getAreasOfInterest());
        mentorship.setStatus(MentorshipStatus.PENDING);
        return mentorshipRepository.save(mentorship);
    }

    public List<Mentorship> getStudentMentorships(String studentId) {
        return mentorshipRepository.findByStudentId(studentId);
    }

    public List<Mentorship> getAlumniMentorships(String alumniId) {
        return mentorshipRepository.findByAlumniId(alumniId);
    }

    public Mentorship acceptMentorship(String mentorshipId, String alumniId, String responseMessage) {
        Mentorship mentorship = mentorshipRepository.findById(mentorshipId)
                .orElseThrow(() -> new RuntimeException("Mentorship not found"));

        if (!mentorship.getAlumniId().equals(alumniId)) {
            throw new RuntimeException("Unauthorized");
        }

        mentorship.setStatus(MentorshipStatus.ACTIVE);
        mentorship.setResponseMessage(responseMessage);
        mentorship.setRespondedAt(LocalDateTime.now());
        mentorship.setStartDate(LocalDateTime.now());
        mentorship.setUpdatedAt(LocalDateTime.now());

        // Update student's mentor list
        studentRepository.findById(mentorship.getStudentId()).ifPresent(student -> {
            if (!student.getMentors().contains(alumniId)) {
                student.getMentors().add(alumniId);
                studentRepository.save(student);
            }
        });

        // Update alumni mentees list
        alumniRepository.findById(alumniId).ifPresent(alumni -> {
            if (!alumni.getMentees().contains(mentorship.getStudentId())) {
                alumni.getMentees().add(mentorship.getStudentId());
                alumniRepository.save(alumni);
            }
        });

        return mentorshipRepository.save(mentorship);
    }

    public Mentorship declineMentorship(String mentorshipId, String alumniId, String responseMessage) {
        Mentorship mentorship = mentorshipRepository.findById(mentorshipId)
                .orElseThrow(() -> new RuntimeException("Mentorship not found"));

        if (!mentorship.getAlumniId().equals(alumniId)) {
            throw new RuntimeException("Unauthorized");
        }

        mentorship.setStatus(MentorshipStatus.DECLINED);
        mentorship.setResponseMessage(responseMessage);
        mentorship.setRespondedAt(LocalDateTime.now());
        mentorship.setUpdatedAt(LocalDateTime.now());
        return mentorshipRepository.save(mentorship);
    }

    public Mentorship submitFeedback(String mentorshipId, String studentId, Integer rating, String review) {
        Mentorship mentorship = mentorshipRepository.findById(mentorshipId)
                .orElseThrow(() -> new RuntimeException("Mentorship not found"));

        if (!mentorship.getStudentId().equals(studentId)) {
            throw new RuntimeException("Unauthorized");
        }

        Mentorship.Feedback feedback = new Mentorship.Feedback(rating, review, LocalDateTime.now());
        mentorship.setStudentFeedback(feedback);
        mentorship.setStatus(MentorshipStatus.COMPLETED);
        mentorship.setEndDate(LocalDateTime.now());
        mentorship.setUpdatedAt(LocalDateTime.now());
        return mentorshipRepository.save(mentorship);
    }
}
