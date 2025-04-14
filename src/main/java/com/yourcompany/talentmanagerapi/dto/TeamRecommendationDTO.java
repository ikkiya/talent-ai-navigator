
package com.yourcompany.talentmanagerapi.dto;

import com.yourcompany.talentmanagerapi.entity.TeamRecommendation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class TeamRecommendationDTO {
    private String projectId;
    private List<EmployeeDTO> recommendedEmployees = new ArrayList<>();
    private Map<String, String> reasonings = new HashMap<>();
    private List<EmployeeDTO> alternativeEmployees = new ArrayList<>();
    private int confidenceScore;

    public TeamRecommendationDTO() {
    }

    public static TeamRecommendationDTO fromEntity(TeamRecommendation recommendation) {
        TeamRecommendationDTO dto = new TeamRecommendationDTO();
        
        if (recommendation.getProject() != null) {
            dto.setProjectId(recommendation.getProject().getId());
        }
        
        // Convert recommended employees
        dto.setRecommendedEmployees(recommendation.getRecommendedEmployees().stream()
                .map(EmployeeDTO::fromEntity)
                .collect(Collectors.toList()));
        
        // Copy reasonings
        dto.setReasonings(new HashMap<>(recommendation.getReasonings()));
        
        // Convert alternative employees
        dto.setAlternativeEmployees(recommendation.getAlternativeEmployees().stream()
                .map(EmployeeDTO::fromEntity)
                .collect(Collectors.toList()));
        
        dto.setConfidenceScore(recommendation.getConfidenceScore());
        
        return dto;
    }

    // Getters and Setters
    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public List<EmployeeDTO> getRecommendedEmployees() {
        return recommendedEmployees;
    }

    public void setRecommendedEmployees(List<EmployeeDTO> recommendedEmployees) {
        this.recommendedEmployees = recommendedEmployees;
    }

    public Map<String, String> getReasonings() {
        return reasonings;
    }

    public void setReasonings(Map<String, String> reasonings) {
        this.reasonings = reasonings;
    }

    public List<EmployeeDTO> getAlternativeEmployees() {
        return alternativeEmployees;
    }

    public void setAlternativeEmployees(List<EmployeeDTO> alternativeEmployees) {
        this.alternativeEmployees = alternativeEmployees;
    }

    public int getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(int confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
}
