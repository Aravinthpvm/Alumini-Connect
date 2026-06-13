package com.alumniportal.controller;

import com.alumniportal.dto.response.ApiResponse;
import com.alumniportal.model.Alumni;
import com.alumniportal.service.AlumniService;
import com.alumniportal.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alumni")
@RequiredArgsConstructor
public class AlumniController {

    private final AlumniService alumniService;
    private final FileUploadUtil fileUploadUtil;

    @GetMapping("/directory")
    public ResponseEntity<ApiResponse<List<Alumni>>> getDirectory() {
        return ResponseEntity.ok(ApiResponse.success(alumniService.getAlumniDirectory()));
    }

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<Alumni>>> search(@RequestBody Map<String, Object> params) {
        String name = (String) params.get("name");
        String company = (String) params.get("company");
        String domain = (String) params.get("domain");
        Integer graduationYear = params.get("graduationYear") != null
                ? Integer.valueOf(params.get("graduationYear").toString())
                : null;
        Boolean availableForMentorship = params.get("availableForMentorship") != null
                ? Boolean.valueOf(params.get("availableForMentorship").toString())
                : null;
        String industry = (String) params.get("industry");
        String location = (String) params.get("location");

        return ResponseEntity.ok(ApiResponse.success(
                alumniService.searchAlumni(name, company, domain, graduationYear, availableForMentorship, industry,
                        location)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Alumni>> getAlumniById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(alumniService.getAlumniById(id)));
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<ApiResponse<Alumni>> getAlumniByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(alumniService.getAlumniByUserId(userId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Alumni>> updateAlumni(
            @PathVariable String id, @RequestBody Alumni updates) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", alumniService.updateAlumni(id, updates)));
    }

    @PostMapping("/{id}/upload-photo")
    public ResponseEntity<ApiResponse<Alumni>> uploadPhoto(
            @PathVariable String id, @RequestParam("file") MultipartFile file) throws IOException {
        if (!fileUploadUtil.isValidImageFile(file)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Only image files are allowed"));
        }
        String url = fileUploadUtil.saveFile(file, "profiles");
        return ResponseEntity.ok(ApiResponse.success("Photo uploaded", alumniService.updateProfilePicture(id, url)));
    }

    @GetMapping("/pending-verifications")
    public ResponseEntity<ApiResponse<List<Alumni>>> getPendingVerifications() {
        return ResponseEntity.ok(ApiResponse.success(alumniService.getPendingVerifications()));
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<ApiResponse<Alumni>> verifyAlumni(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam String adminId) {
        return ResponseEntity
                .ok(ApiResponse.success("Verification updated", alumniService.verifyAlumni(id, status, adminId)));
    }
}
