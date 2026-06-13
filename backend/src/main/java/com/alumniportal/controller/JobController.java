package com.alumniportal.controller;

import com.alumniportal.dto.request.JobApplicationRequest;
import com.alumniportal.dto.request.JobRequest;
import com.alumniportal.dto.response.ApiResponse;
import com.alumniportal.model.Job;
import com.alumniportal.model.JobApplication;
import com.alumniportal.service.ApplicationService;
import com.alumniportal.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Job>>> getAllJobs() {
        return ResponseEntity.ok(ApiResponse.success(jobService.getAllActiveJobs()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Job>> createJob(
            @RequestParam String alumniId,
            @RequestBody JobRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Job posted", jobService.createJob(alumniId, request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Job>> getJobById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(jobService.getJobById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Job>> updateJob(
            @PathVariable String id,
            @RequestParam String alumniId,
            @RequestBody JobRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Job updated", jobService.updateJob(id, alumniId, request)));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<ApiResponse<Job>> closeJob(
            @PathVariable String id, @RequestParam String alumniId) {
        return ResponseEntity.ok(ApiResponse.success("Job closed", jobService.closeJob(id, alumniId)));
    }

    @GetMapping("/by-alumni/{alumniId}")
    public ResponseEntity<ApiResponse<List<Job>>> getJobsByAlumni(@PathVariable String alumniId) {
        return ResponseEntity.ok(ApiResponse.success(jobService.getJobsByAlumni(alumniId)));
    }

    @PostMapping("/{jobId}/apply")
    public ResponseEntity<ApiResponse<JobApplication>> applyToJob(
            @PathVariable String jobId,
            @RequestParam String studentId,
            @RequestParam(required = false) String resumeUrl,
            @RequestBody JobApplicationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Application submitted",
                applicationService.applyToJob(jobId, studentId, resumeUrl, request.getCoverLetter())));
    }

    @GetMapping("/{jobId}/applications")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getApplications(@PathVariable String jobId) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getApplicationsForJob(jobId)));
    }

    @GetMapping("/applications/student/{studentId}")
    public ResponseEntity<ApiResponse<List<JobApplication>>> getStudentApplications(@PathVariable String studentId) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getStudentApplications(studentId)));
    }

    @PatchMapping("/applications/{applicationId}/status")
    public ResponseEntity<ApiResponse<JobApplication>> updateApplicationStatus(
            @PathVariable String applicationId,
            @RequestParam String alumniId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                applicationService.updateApplicationStatus(applicationId, alumniId,
                        body.get("status"), body.get("reviewNotes"))));
    }
}
