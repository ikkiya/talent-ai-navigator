
package com.yourcompany.talentmanagerapi.controller;

import com.yourcompany.talentmanagerapi.dto.ProjectDTO;
import com.yourcompany.talentmanagerapi.entity.Project;
import com.yourcompany.talentmanagerapi.entity.ProjectStatus;
import com.yourcompany.talentmanagerapi.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        List<ProjectDTO> projectDTOs = projects.stream()
            .map(ProjectDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(projectDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable String id) {
        Optional<Project> projectOptional = projectService.getProjectById(id);
        if (projectOptional.isPresent()) {
            ProjectDTO projectDTO = ProjectDTO.fromEntity(projectOptional.get());
            return ResponseEntity.ok(projectDTO);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByStatus(@PathVariable String status) {
        try {
            ProjectStatus projectStatus = ProjectStatus.valueOf(status);
            List<Project> projects = projectService.getProjectsByStatus(projectStatus);
            List<ProjectDTO> projectDTOs = projects.stream()
                .map(ProjectDTO::fromEntity)
                .collect(Collectors.toList());
            return ResponseEntity.ok(projectDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/startDate")
    public ResponseEntity<List<ProjectDTO>> getProjectsByStartDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Project> projects = projectService.getProjectsByStartDateRange(startDate, endDate);
        List<ProjectDTO> projectDTOs = projects.stream()
            .map(ProjectDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(projectDTOs);
    }
    
    @GetMapping("/endDate")
    public ResponseEntity<List<ProjectDTO>> getProjectsByEndDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Project> projects = projectService.getProjectsByEndDateRange(startDate, endDate);
        List<ProjectDTO> projectDTOs = projects.stream()
            .map(ProjectDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(projectDTOs);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ProjectDTO>> searchProjectsByName(@RequestParam String name) {
        List<Project> projects = projectService.searchProjectsByName(name);
        List<ProjectDTO> projectDTOs = projects.stream()
            .map(ProjectDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(projectDTOs);
    }
    
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project) {
        try {
            Project savedProject = projectService.saveProject(project);
            ProjectDTO projectDTO = ProjectDTO.fromEntity(savedProject);
            return ResponseEntity.status(HttpStatus.CREATED).body(projectDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Failed to create project: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable String id, @RequestBody Project project) {
        try {
            Optional<Project> projectOptional = projectService.getProjectById(id);
            if (projectOptional.isPresent()) {
                project.setId(id);
                Project updatedProject = projectService.saveProject(project);
                ProjectDTO projectDTO = ProjectDTO.fromEntity(updatedProject);
                return ResponseEntity.ok(projectDTO);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Failed to update project: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable String id) {
        try {
            Optional<Project> projectOptional = projectService.getProjectById(id);
            if (projectOptional.isPresent()) {
                projectService.deleteProject(id);
                return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to delete project: " + e.getMessage()));
        }
    }
}
