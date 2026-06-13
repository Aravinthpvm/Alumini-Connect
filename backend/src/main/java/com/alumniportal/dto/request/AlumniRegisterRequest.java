package com.alumniportal.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AlumniRegisterRequest {
    @NotBlank
    private String fullName;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    @Size(min = 6)
    private String password;
    private String phoneNumber;
    private String rollNumber;
    private String branch;
    private Integer graduationYear;
    private String currentCompany;
    private String currentPosition;
    private Integer yearsOfExperience;
    private String industry;
    private String location;
}
