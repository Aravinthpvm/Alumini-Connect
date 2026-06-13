package com.alumniportal.service;

import com.alumniportal.dto.request.JobRequest;
import com.alumniportal.model.Job;
import com.alumniportal.model.enums.JobType;
import com.alumniportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    public Job createJob(String alumniId, JobRequest request) {
        Job job = new Job();
        job.setPostedBy(alumniId);
        job.setJobTitle(request.getJobTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setLocationType(request.getLocationType());
        job.setJobType(JobType.valueOf(request.getJobType().toUpperCase()));
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setPreferredSkills(request.getPreferredSkills());
        job.setExperienceRequired(request.getExperienceRequired());
        if (request.getSalaryMin() != null || request.getSalaryMax() != null) {
            job.setSalaryRange(new Job.SalaryRange(request.getSalaryMin(), request.getSalaryMax(), "INR"));
        }
        if (request.getApplicationDeadline() != null) {
            job.setApplicationDeadline(LocalDateTime.parse(request.getApplicationDeadline()));
        }
        job.setApplicationUrl(request.getApplicationUrl());
        job.setApplicationEmail(request.getApplicationEmail());
        return jobRepository.save(job);
    }

    public List<Job> getAllActiveJobs() {
        return jobRepository.findByStatusOrderByCreatedAtDesc("ACTIVE");
    }

    public Job getJobById(String id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setViewCount(job.getViewCount() + 1);
        return jobRepository.save(job);
    }

    public List<Job> getJobsByAlumni(String alumniId) {
        return jobRepository.findByPostedBy(alumniId);
    }

    public Job updateJob(String jobId, String alumniId, JobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getPostedBy().equals(alumniId)) {
            throw new RuntimeException("Unauthorized");
        }
        if (request.getJobTitle() != null)
            job.setJobTitle(request.getJobTitle());
        if (request.getDescription() != null)
            job.setDescription(request.getDescription());
        if (request.getRequirements() != null)
            job.setRequirements(request.getRequirements());
        if (request.getPreferredSkills() != null)
            job.setPreferredSkills(request.getPreferredSkills());
        job.setUpdatedAt(LocalDateTime.now());
        return jobRepository.save(job);
    }

    public Job closeJob(String jobId, String alumniId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getPostedBy().equals(alumniId)) {
            throw new RuntimeException("Unauthorized");
        }
        job.setStatus("CLOSED");
        job.setUpdatedAt(LocalDateTime.now());
        return jobRepository.save(job);
    }
}
