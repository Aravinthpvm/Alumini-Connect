package com.alumniportal.service;

import com.alumniportal.config.SecurityConfig;
import com.alumniportal.dto.request.AlumniRegisterRequest;
import com.alumniportal.dto.request.LoginRequest;
import com.alumniportal.dto.request.StudentRegisterRequest;
import com.alumniportal.dto.response.AuthResponse;
import com.alumniportal.model.Alumni;
import com.alumniportal.model.Student;
import com.alumniportal.model.User;
import com.alumniportal.model.enums.UserRole;
import com.alumniportal.repository.AlumniRepository;
import com.alumniportal.repository.StudentRepository;
import com.alumniportal.repository.UserRepository;
import com.alumniportal.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AlumniRepository alumniRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse registerStudent(StudentRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(UserRole.STUDENT);
        User savedUser = userRepository.save(user);

        Student student = new Student();
        student.setUserId(savedUser.getId());
        student.setFullName(request.getFullName());
        student.setEmail(request.getEmail());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setRollNumber(request.getRollNumber());
        student.setBranch(request.getBranch());
        student.setCurrentYear(request.getCurrentYear());
        student.setGraduationYear(request.getGraduationYear());
        Student savedStudent = studentRepository.save(student);

        UserDetails userDetails = buildUserDetails(savedUser);
        String token = jwtUtil.generateToken(userDetails, savedUser.getId(), savedUser.getRole().name());

        return new AuthResponse(token, savedUser.getId(), savedUser.getRole().name(),
                savedUser.getEmail(), savedUser.getFullName(), savedStudent.getId(),
                "Student registered successfully");
    }

    public AuthResponse registerAlumni(AlumniRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(UserRole.ALUMNI);
        User savedUser = userRepository.save(user);

        Alumni alumni = new Alumni();
        alumni.setUserId(savedUser.getId());
        alumni.setFullName(request.getFullName());
        alumni.setEmail(request.getEmail());
        alumni.setPhoneNumber(request.getPhoneNumber());
        alumni.setRollNumber(request.getRollNumber());
        alumni.setBranch(request.getBranch());
        alumni.setGraduationYear(request.getGraduationYear());
        alumni.setCurrentCompany(request.getCurrentCompany());
        alumni.setCurrentPosition(request.getCurrentPosition());
        alumni.setYearsOfExperience(request.getYearsOfExperience());
        alumni.setIndustry(request.getIndustry());
        alumni.setLocation(request.getLocation());
        Alumni savedAlumni = alumniRepository.save(alumni);

        UserDetails userDetails = buildUserDetails(savedUser);
        String token = jwtUtil.generateToken(userDetails, savedUser.getId(), savedUser.getRole().name());

        return new AuthResponse(token, savedUser.getId(), savedUser.getRole().name(),
                savedUser.getEmail(), savedUser.getFullName(), savedAlumni.getId(),
                "Alumni registered successfully. Pending verification.");
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = buildUserDetails(user);
        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

        String profileId = switch (user.getRole()) {
            case STUDENT -> studentRepository.findByUserId(user.getId())
                    .map(Student::getId).orElse(null);
            case ALUMNI -> alumniRepository.findByUserId(user.getId())
                    .map(Alumni::getId).orElse(null);
            default -> null;
        };

        return new AuthResponse(token, user.getId(), user.getRole().name(),
                user.getEmail(), user.getFullName(), profileId, "Login successful");
    }

    private UserDetails buildUserDetails(User user) {
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority(user.getRole().name())))
                .build();
    }
}
