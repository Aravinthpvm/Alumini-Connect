package com.alumniportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String userId;
    private String role;
    private String email;
    private String fullName;
    private String profileId; // studentId or alumniId
    private String message;
}
