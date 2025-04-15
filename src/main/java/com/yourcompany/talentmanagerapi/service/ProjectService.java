
package com.yourcompany.talentmanagerapi.service;

import com.yourcompany.talentmanagerapi.entity.Project;
import com.yourcompany.talentmanagerapi.entity.ProjectStatus;
import com.yourcompany.talentmanagerapi.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    public Optional<Project> getProjectById(String id) {
        return projectRepository.findById(id);
    }
    
    public List<Project> getProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }
    
    public List<Project> getProjectsByStartDateRange(LocalDate startDate, LocalDate endDate) {
        return projectRepository.findByStartDateBetween(startDate, endDate);
    }
    
    public List<Project> getProjectsByEndDateRange(LocalDate startDate, LocalDate endDate) {
        return projectRepository.findByEndDateBetween(startDate, endDate);
    }
    
    public List<Project> searchProjectsByName(String name) {
        return projectRepository.findByNameContainingIgnoreCase(name);
    }
    
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }
    
    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }
    
    public List<Project> saveAllProjects(List<Project> projects) {
        return projectRepository.saveAll(projects);
    }
}
