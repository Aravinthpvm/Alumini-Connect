package com.alumniportal.service;

import com.alumniportal.model.Job;
import com.alumniportal.model.JobApplication;
import com.alumniportal.model.enums.ApplicationStatus;
import com.alumniportal.repository.JobApplicationRepository;
import com.alumniportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public JobApplication applyToJob(String jobId, String studentId, String resumeUrl, String coverLetter) {
        if (applicationRepository.existsByJobIdAndStudentId(jobId, studentId)) {
            throw new RuntimeException("You have already applied to this job");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!"ACTIVE".equals(job.getStatus())) {
            throw new RuntimeException("Job is no longer accepting applications");
        }

        JobApplication application = new JobApplication();
        application.setJobId(jobId);
        application.setStudentId(studentId);
        application.setAlumniId(job.getPostedBy());
        application.setResume(resumeUrl);
        application.setCoverLetter(coverLetter);
        application.setStatus(ApplicationStatus.APPLIED);

        job.setApplicationCount(job.getApplicationCount() + 1);
        jobRepository.save(job);

        return applicationRepository.save(application);
    }

    public List<JobApplication> getApplicationsForJob(String jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public List<JobApplication> getStudentApplications(String studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public JobApplication updateApplicationStatus(String applicationId, String alumniId,
            String status, String reviewNotes) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getAlumniId().equals(alumniId)) {
            throw new RuntimeException("Unauthorized");
        }

        application.setStatus(ApplicationStatus.valueOf(status));
        application.setReviewNotes(reviewNotes);
        application.setReviewedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());
        return applicationRepository.save(application);
    }
}
