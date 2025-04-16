
package com.yourcompany.talentmanagerapi.controller;

import com.yourcompany.talentmanagerapi.dto.ProjectAssignmentDTO;
import com.yourcompany.talentmanagerapi.entity.Employee;
import com.yourcompany.talentmanagerapi.entity.Project;
import com.yourcompany.talentmanagerapi.entity.ProjectAssignment;
import com.yourcompany.talentmanagerapi.service.EmployeeService;
import com.yourcompany.talentmanagerapi.service.ProjectAssignmentService;
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
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProjectAssignmentController {
    
    @Autowired
    private ProjectAssignmentService projectAssignmentService;
    
    @Autowired
    private EmployeeService employeeService;
    
    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<List<ProjectAssignmentDTO>> getAllProjectAssignments() {
        List<ProjectAssignment> assignments = projectAssignmentService.getAllProjectAssignments();
        List<ProjectAssignmentDTO> assignmentDTOs = assignments.stream()
            .map(ProjectAssignmentDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(assignmentDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectAssignmentById(@PathVariable String id) {
        Optional<ProjectAssignment> assignmentOptional = projectAssignmentService.getProjectAssignmentById(id);
        if (assignmentOptional.isPresent()) {
            ProjectAssignmentDTO assignmentDTO = ProjectAssignmentDTO.fromEntity(assignmentOptional.get());
            return ResponseEntity.ok(assignmentDTO);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<ProjectAssignmentDTO>> getProjectAssignmentsByEmployee(@PathVariable String employeeId) {
        Optional<Employee> employeeOptional = employeeService.getEmployeeById(employeeId);
        if (employeeOptional.isPresent()) {
            List<ProjectAssignment> assignments = projectAssignmentService.getProjectAssignmentsByEmployee(employeeOptional.get());
            List<ProjectAssignmentDTO> assignmentDTOs = assignments.stream()
                .map(ProjectAssignmentDTO::fromEntity)
                .collect(Collectors.toList());
            return ResponseEntity.ok(assignmentDTOs);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectAssignmentDTO>> getProjectAssignmentsByProject(@PathVariable String projectId) {
        Optional<Project> projectOptional = projectService.getProjectById(projectId);
        if (projectOptional.isPresent()) {
            List<ProjectAssignment> assignments = projectAssignmentService.getProjectAssignmentsByProject(projectOptional.get());
            List<ProjectAssignmentDTO> assignmentDTOs = assignments.stream()
                .map(ProjectAssignmentDTO::fromEntity)
                .collect(Collectors.toList());
            return ResponseEntity.ok(assignmentDTOs);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/startDate")
    public ResponseEntity<List<ProjectAssignmentDTO>> getProjectAssignmentsByStartDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ProjectAssignment> assignments = projectAssignmentService.getProjectAssignmentsByStartDateRange(startDate, endDate);
        List<ProjectAssignmentDTO> assignmentDTOs = assignments.stream()
            .map(ProjectAssignmentDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(assignmentDTOs);
    }
    
    @GetMapping("/endDate")
    public ResponseEntity<List<ProjectAssignmentDTO>> getProjectAssignmentsByEndDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ProjectAssignment> assignments = projectAssignmentService.getProjectAssignmentsByEndDateRange(startDate, endDate);
        List<ProjectAssignmentDTO> assignmentDTOs = assignments.stream()
            .map(ProjectAssignmentDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(assignmentDTOs);
    }
    
    @GetMapping("/role/{role}")
    public ResponseEntity<List<ProjectAssignmentDTO>> getProjectAssignmentsByRole(@PathVariable String role) {
        List<ProjectAssignment> assignments = projectAssignmentService.getProjectAssignmentsByRole(role);
        List<ProjectAssignmentDTO> assignmentDTOs = assignments.stream()
            .map(ProjectAssignmentDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(assignmentDTOs);
    }
    
    @PostMapping
    public ResponseEntity<?> createProjectAssignment(@RequestBody ProjectAssignment projectAssignment) {
        try {
            ProjectAssignment savedAssignment = projectAssignmentService.saveProjectAssignment(projectAssignment);
            ProjectAssignmentDTO assignmentDTO = ProjectAssignmentDTO.fromEntity(savedAssignment);
            return ResponseEntity.status(HttpStatus.CREATED).body(assignmentDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Failed to create project assignment: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProjectAssignment(@PathVariable String id, @RequestBody ProjectAssignment projectAssignment) {
        try {
            Optional<ProjectAssignment> assignmentOptional = projectAssignmentService.getProjectAssignmentById(id);
            if (assignmentOptional.isPresent()) {
                projectAssignment.setId(id);
                ProjectAssignment updatedAssignment = projectAssignmentService.saveProjectAssignment(projectAssignment);
                ProjectAssignmentDTO assignmentDTO = ProjectAssignmentDTO.fromEntity(updatedAssignment);
                return ResponseEntity.ok(assignmentDTO);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Failed to update project assignment: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProjectAssignment(@PathVariable String id) {
        try {
            Optional<ProjectAssignment> assignmentOptional = projectAssignmentService.getProjectAssignmentById(id);
            if (assignmentOptional.isPresent()) {
                projectAssignmentService.deleteProjectAssignment(id);
                return ResponseEntity.ok(Map.of("message", "Project assignment deleted successfully"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to delete project assignment: " + e.getMessage()));
        }
    }
}
