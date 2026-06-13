package com.alumniportal.controller;

import com.alumniportal.dto.request.AlumniRegisterRequest;
import com.alumniportal.dto.request.LoginRequest;
import com.alumniportal.dto.request.StudentRegisterRequest;
import com.alumniportal.dto.response.ApiResponse;
import com.alumniportal.dto.response.AuthResponse;
import com.alumniportal.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/student")
    public ResponseEntity<ApiResponse<AuthResponse>> registerStudent(
            @Valid @RequestBody StudentRegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Student registered", authService.registerStudent(request)));
    }

    @PostMapping("/register/alumni")
    public ResponseEntity<ApiResponse<AuthResponse>> registerAlumni(
            @Valid @RequestBody AlumniRegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Alumni registered", authService.registerAlumni(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Login successful", authService.login(request)));
    }
}
