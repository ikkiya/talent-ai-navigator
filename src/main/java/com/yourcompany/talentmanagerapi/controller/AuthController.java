
package com.yourcompany.talentmanagerapi.controller;

import com.yourcompany.talentmanagerapi.dto.AuthResponseDTO;
import com.yourcompany.talentmanagerapi.dto.LoginRequestDTO;
import com.yourcompany.talentmanagerapi.dto.RefreshTokenRequestDTO;
import com.yourcompany.talentmanagerapi.dto.UserDTO;
import com.yourcompany.talentmanagerapi.entity.User;
import com.yourcompany.talentmanagerapi.service.AuthService;
import com.yourcompany.talentmanagerapi.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtService jwtService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            System.out.println("Login request received for email: " + loginRequest.getEmail());
            
            // Validate request
            if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email and password are required"));
            }
            
            AuthResponseDTO response = authService.login(loginRequest);
            if (response != null) {
                Map<String, Object> result = new HashMap<>();
                result.put("token", response.getToken());
                result.put("user", response.getUser());
                result.put("refreshToken", jwtService.generateRefreshToken(loginRequest.getEmail()));
                
                System.out.println("Login successful for: " + loginRequest.getEmail());
                return ResponseEntity.ok(result);
            } else {
                System.out.println("Authentication failed for: " + loginRequest.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication failed"));
            }
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequestDTO request) {
        try {
            String refreshToken = request.getRefreshToken();
            String email = jwtService.extractUsername(refreshToken);
            
            // Validate the refresh token
            if (email != null && !jwtService.isTokenExpired(refreshToken)) {
                String newToken = jwtService.generateToken(email);
                String newRefreshToken = jwtService.generateRefreshToken(email);
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", newToken);
                response.put("refreshToken", newRefreshToken);
                
                return ResponseEntity.ok(response);
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid refresh token"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Token refresh failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid authorization header"));
            }
            
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String email = jwtService.extractUsername(token);
            
            if (email != null && !jwtService.isTokenExpired(token)) {
                Optional<User> userOptional = authService.getCurrentUser();
                
                if (userOptional.isPresent()) {
                    UserDTO userDTO = UserDTO.fromEntity(userOptional.get());
                    return ResponseEntity.ok(userDTO);
                }
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Unauthorized"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
        try {
            authService.logout();
            return ResponseEntity.ok(Map.of("message", "Logout successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Logout failed: " + e.getMessage()));
        }
    }
}
