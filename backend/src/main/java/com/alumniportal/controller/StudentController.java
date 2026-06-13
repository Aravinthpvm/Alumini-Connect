package com.alumniportal.controller;

import com.alumniportal.dto.response.ApiResponse;
import com.alumniportal.model.Student;
import com.alumniportal.service.StudentService;
import com.alumniportal.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final FileUploadUtil fileUploadUtil;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> getStudentById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getStudentById(id)));
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<ApiResponse<Student>> getStudentByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getStudentByUserId(userId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> updateStudent(
            @PathVariable String id, @RequestBody Student updates) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", studentService.updateStudent(id, updates)));
    }

    @PostMapping("/{id}/upload-resume")
    public ResponseEntity<ApiResponse<Student>> uploadResume(
            @PathVariable String id, @RequestParam("file") MultipartFile file) throws IOException {
        if (!fileUploadUtil.isValidPdfFile(file)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Only PDF files are allowed for resumes"));
        }
        String url = fileUploadUtil.saveFile(file, "resumes");
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded", studentService.updateResume(id, url)));
    }

    @PostMapping("/{id}/upload-photo")
    public ResponseEntity<ApiResponse<Student>> uploadPhoto(
            @PathVariable String id, @RequestParam("file") MultipartFile file) throws IOException {
        if (!fileUploadUtil.isValidImageFile(file)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Only image files are allowed"));
        }
        String url = fileUploadUtil.saveFile(file, "profiles");
        return ResponseEntity.ok(ApiResponse.success("Photo uploaded", studentService.updateProfilePicture(id, url)));
    }
}
