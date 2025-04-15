
package com.yourcompany.talentmanagerapi.service;

import com.yourcompany.talentmanagerapi.dto.AuthResponseDTO;
import com.yourcompany.talentmanagerapi.dto.LoginRequestDTO;
import com.yourcompany.talentmanagerapi.dto.UserDTO;
import com.yourcompany.talentmanagerapi.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        // Authenticate using Spring Security
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generate JWT token
        String token = jwtService.generateToken(loginRequest.getEmail());
        
        // Update last login timestamp
        Optional<User> userOptional = userService.getUserByEmail(loginRequest.getEmail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setLastLogin(LocalDateTime.now());
            userService.saveUser(user);
            
            UserDTO userDTO = UserDTO.fromEntity(user);
            return new AuthResponseDTO(token, userDTO);
        }
        
        return null;
    }
    
    public void logout() {
        SecurityContextHolder.clearContext();
    }
    
    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            return userService.getUserByEmail(email);
        }
        return Optional.empty();
    }
}
