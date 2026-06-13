package com.alumniportal.controller;

import com.alumniportal.dto.response.ApiResponse;
import com.alumniportal.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentDashboard(
            @PathVariable String studentId) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStudentDashboard(studentId)));
    }

    @GetMapping("/alumni/{alumniId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAlumniDashboard(
            @PathVariable String alumniId) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAlumniDashboard(alumniId)));
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminDashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAdminDashboard()));
    }
}
