package com.alumniportal.service;

import com.alumniportal.model.enums.MentorshipStatus;
import com.alumniportal.model.enums.VerificationStatus;
import com.alumniportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

        private final StudentRepository studentRepository;
        private final AlumniRepository alumniRepository;
        private final MentorshipRepository mentorshipRepository;
        private final JobRepository jobRepository;
        private final JobApplicationRepository applicationRepository;
        private final EventRepository eventRepository;
        private final QuestionRepository questionRepository;

        public Map<String, Object> getStudentDashboard(String studentId) {
                Map<String, Object> dashboard = new HashMap<>();
                var student = studentRepository.findById(studentId)
                                .orElseThrow(() -> new RuntimeException("Student not found"));

                dashboard.put("profile", student);
                dashboard.put("activeMentorships",
                                mentorshipRepository.findByStudentIdAndStatus(studentId, MentorshipStatus.ACTIVE)
                                                .size());
                dashboard.put("pendingMentorships",
                                mentorshipRepository.findByStudentIdAndStatus(studentId, MentorshipStatus.PENDING)
                                                .size());
                dashboard.put("appliedJobs",
                                applicationRepository.findByStudentId(studentId).size());
                dashboard.put("registeredEvents",
                                eventRepository.findByRegisteredStudentsContaining(studentId).size());
                dashboard.put("myQuestions",
                                questionRepository.findByAskedBy(studentId).size());
                return dashboard;
        }

        public Map<String, Object> getAlumniDashboard(String alumniId) {
                Map<String, Object> dashboard = new HashMap<>();
                var alumni = alumniRepository.findById(alumniId)
                                .orElseThrow(() -> new RuntimeException("Alumni not found"));

                dashboard.put("profile", alumni);
                dashboard.put("activeMentees",
                                mentorshipRepository.findByAlumniIdAndStatus(alumniId, MentorshipStatus.ACTIVE).size());
                dashboard.put("pendingRequests",
                                mentorshipRepository.findByAlumniIdAndStatus(alumniId, MentorshipStatus.PENDING)
                                                .size());
                dashboard.put("postedJobs", jobRepository.findByPostedBy(alumniId).size());
                dashboard.put("totalApplications",
                                applicationRepository.findByAlumniId(alumniId).size());
                dashboard.put("organizedEvents",
                                eventRepository.findByOrganizer(alumniId).size());
                dashboard.put("answeredQuestions",
                                questionRepository.findByAskedBy(alumniId).size());
                return dashboard;
        }

        public Map<String, Object> getAdminDashboard() {
                Map<String, Object> dashboard = new HashMap<>();
                dashboard.put("totalStudents", studentRepository.count());
                dashboard.put("totalAlumni", alumniRepository.count());
                dashboard.put("pendingVerifications",
                                alumniRepository.countByVerificationStatus(VerificationStatus.PENDING));
                dashboard.put("verifiedAlumni",
                                alumniRepository.countByVerificationStatus(VerificationStatus.VERIFIED));
                dashboard.put("activeJobs", jobRepository.countByStatus("ACTIVE"));
                dashboard.put("upcomingEvents", eventRepository.countByStatus("UPCOMING"));
                dashboard.put("totalQuestions", questionRepository.count());
                dashboard.put("activeMentorships",
                                mentorshipRepository.countByStatus(MentorshipStatus.ACTIVE));
                return dashboard;
        }
}
