
package com.yourcompany.talentmanagerapi.dto;

import com.yourcompany.talentmanagerapi.entity.Project;
import com.yourcompany.talentmanagerapi.entity.ProjectStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ProjectDTO {
    private String id;
    private String name;
    private String description;
    private String startDate;
    private String endDate;
    private ProjectStatus status;
    private List<EmployeeDTO> teamMembers = new ArrayList<>();
    private List<String> requiredSkills = new ArrayList<>();

    public ProjectDTO() {
    }

    public static ProjectDTO fromEntity(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        
        if (project.getStartDate() != null) {
            dto.setStartDate(project.getStartDate().toString());
        }
        
        if (project.getEndDate() != null) {
            dto.setEndDate(project.getEndDate().toString());
        }
        
        dto.setTeamMembers(project.getTeamMembers().stream()
                .map(EmployeeDTO::fromEntity)
                .collect(Collectors.toList()));
                
        dto.setRequiredSkills(new ArrayList<>(project.getRequiredSkills()));
        
        return dto;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public List<EmployeeDTO> getTeamMembers() {
        return teamMembers;
    }

    public void setTeamMembers(List<EmployeeDTO> teamMembers) {
        this.teamMembers = teamMembers;
    }

    public List<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
}
