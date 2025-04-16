
package com.yourcompany.talentmanagerapi.controller;

import com.yourcompany.talentmanagerapi.dto.TeamRecommendationDTO;
import com.yourcompany.talentmanagerapi.entity.Project;
import com.yourcompany.talentmanagerapi.entity.TeamRecommendation;
import com.yourcompany.talentmanagerapi.service.ProjectService;
import com.yourcompany.talentmanagerapi.service.TeamRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TeamRecommendationController {
    
    @Autowired
    private TeamRecommendationService teamRecommendationService;
    
    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<List<TeamRecommendationDTO>> getAllTeamRecommendations() {
        List<TeamRecommendation> recommendations = teamRecommendationService.getAllTeamRecommendations();
        List<TeamRecommendationDTO> recommendationDTOs = recommendations.stream()
            .map(TeamRecommendationDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(recommendationDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getTeamRecommendationById(@PathVariable String id) {
        Optional<TeamRecommendation> recommendationOptional = teamRecommendationService.getTeamRecommendationById(id);
        if (recommendationOptional.isPresent()) {
            TeamRecommendationDTO recommendationDTO = TeamRecommendationDTO.fromEntity(recommendationOptional.get());
            return ResponseEntity.ok(recommendationDTO);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getTeamRecommendationByProject(@PathVariable String projectId) {
        Optional<Project> projectOptional = projectService.getProjectById(projectId);
        if (projectOptional.isPresent()) {
            List<TeamRecommendation> recommendations = teamRecommendationService.getTeamRecommendationsByProject(projectOptional.get());
            if (!recommendations.isEmpty()) {
                List<TeamRecommendationDTO> recommendationDTOs = recommendations.stream()
                    .map(TeamRecommendationDTO::fromEntity)
                    .collect(Collectors.toList());
                return ResponseEntity.ok(recommendationDTOs);
            }
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/projectId/{projectId}")
    public ResponseEntity<?> getTeamRecommendationByProjectId(@PathVariable String projectId) {
        Optional<TeamRecommendation> recommendationOptional = teamRecommendationService.getTeamRecommendationByProjectId(projectId);
        if (recommendationOptional.isPresent()) {
            TeamRecommendationDTO recommendationDTO = TeamRecommendationDTO.fromEntity(recommendationOptional.get());
            return ResponseEntity.ok(recommendationDTO);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/confidenceScore/{threshold}")
    public ResponseEntity<List<TeamRecommendationDTO>> getTeamRecommendationsByConfidenceScore(@PathVariable int threshold) {
        List<TeamRecommendation> recommendations = teamRecommendationService.getTeamRecommendationsByConfidenceScore(threshold);
        List<TeamRecommendationDTO> recommendationDTOs = recommendations.stream()
            .map(TeamRecommendationDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(recommendationDTOs);
    }
    
    @PostMapping
    public ResponseEntity<?> createTeamRecommendation(@RequestBody TeamRecommendation teamRecommendation) {
        try {
            TeamRecommendation savedRecommendation = teamRecommendationService.saveTeamRecommendation(teamRecommendation);
            TeamRecommendationDTO recommendationDTO = TeamRecommendationDTO.fromEntity(savedRecommendation);
            return ResponseEntity.status(HttpStatus.CREATED).body(recommendationDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Failed to create team recommendation: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeamRecommendation(@PathVariable String id, @RequestBody TeamRecommendation teamRecommendation) {
        try {
            Optional<TeamRecommendation> recommendationOptional = teamRecommendationService.getTeamRecommendationById(id);
            if (recommendationOptional.isPresent()) {
                teamRecommendation.setId(id);
                TeamRecommendation updatedRecommendation = teamRecommendationService.saveTeamRecommendation(teamRecommendation);
                TeamRecommendationDTO recommendationDTO = TeamRecommendationDTO.fromEntity(updatedRecommendation);
                return ResponseEntity.ok(recommendationDTO);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Failed to update team recommendation: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeamRecommendation(@PathVariable String id) {
        try {
            Optional<TeamRecommendation> recommendationOptional = teamRecommendationService.getTeamRecommendationById(id);
            if (recommendationOptional.isPresent()) {
                teamRecommendationService.deleteTeamRecommendation(id);
                return ResponseEntity.ok(Map.of("message", "Team recommendation deleted successfully"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to delete team recommendation: " + e.getMessage()));
        }
    }
}
