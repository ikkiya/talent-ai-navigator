
package com.yourcompany.talentmanagerapi.service;

import com.yourcompany.talentmanagerapi.entity.Project;
import com.yourcompany.talentmanagerapi.entity.TeamRecommendation;
import com.yourcompany.talentmanagerapi.repository.TeamRecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamRecommendationService {
    
    @Autowired
    private TeamRecommendationRepository teamRecommendationRepository;
    
    public List<TeamRecommendation> getAllTeamRecommendations() {
        return teamRecommendationRepository.findAll();
    }
    
    public Optional<TeamRecommendation> getTeamRecommendationById(String id) {
        return teamRecommendationRepository.findById(id);
    }
    
    public List<TeamRecommendation> getTeamRecommendationsByProject(Project project) {
        return teamRecommendationRepository.findByProject(project);
    }
    
    public Optional<TeamRecommendation> getTeamRecommendationByProjectId(String projectId) {
        return teamRecommendationRepository.findByProjectId(projectId);
    }
    
    public List<TeamRecommendation> getTeamRecommendationsByConfidenceScore(int confidenceScoreThreshold) {
        return teamRecommendationRepository.findByConfidenceScoreGreaterThan(confidenceScoreThreshold);
    }
    
    public TeamRecommendation saveTeamRecommendation(TeamRecommendation teamRecommendation) {
        return teamRecommendationRepository.save(teamRecommendation);
    }
    
    public void deleteTeamRecommendation(String id) {
        teamRecommendationRepository.deleteById(id);
    }
    
    public List<TeamRecommendation> saveAllTeamRecommendations(List<TeamRecommendation> recommendations) {
        return teamRecommendationRepository.saveAll(recommendations);
    }
}
