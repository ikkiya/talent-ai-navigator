
package com.yourcompany.talentmanagerapi.service;

import com.yourcompany.talentmanagerapi.entity.Employee;
import com.yourcompany.talentmanagerapi.entity.Project;
import com.yourcompany.talentmanagerapi.entity.ProjectAssignment;
import com.yourcompany.talentmanagerapi.repository.ProjectAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectAssignmentService {
    
    @Autowired
    private ProjectAssignmentRepository projectAssignmentRepository;
    
    public List<ProjectAssignment> getAllProjectAssignments() {
        return projectAssignmentRepository.findAll();
    }
    
    public Optional<ProjectAssignment> getProjectAssignmentById(String id) {
        return projectAssignmentRepository.findById(id);
    }
    
    public List<ProjectAssignment> getProjectAssignmentsByEmployee(Employee employee) {
        return projectAssignmentRepository.findByEmployee(employee);
    }
    
    public List<ProjectAssignment> getProjectAssignmentsByProject(Project project) {
        return projectAssignmentRepository.findByProject(project);
    }
    
    public List<ProjectAssignment> getProjectAssignmentsByEmployeeAndProject(Employee employee, Project project) {
        return projectAssignmentRepository.findByEmployeeAndProject(employee, project);
    }
    
    public List<ProjectAssignment> getProjectAssignmentsByStartDateRange(LocalDate startDate, LocalDate endDate) {
        return projectAssignmentRepository.findByStartDateBetween(startDate, endDate);
    }
    
    public List<ProjectAssignment> getProjectAssignmentsByEndDateRange(LocalDate startDate, LocalDate endDate) {
        return projectAssignmentRepository.findByEndDateBetween(startDate, endDate);
    }
    
    public List<ProjectAssignment> getProjectAssignmentsByRole(String role) {
        return projectAssignmentRepository.findByRole(role);
    }
    
    public ProjectAssignment saveProjectAssignment(ProjectAssignment projectAssignment) {
        return projectAssignmentRepository.save(projectAssignment);
    }
    
    public void deleteProjectAssignment(String id) {
        projectAssignmentRepository.deleteById(id);
    }
    
    public List<ProjectAssignment> saveAllProjectAssignments(List<ProjectAssignment> assignments) {
        return projectAssignmentRepository.saveAll(assignments);
    }
}
