
package com.yourcompany.talentmanagerapi.dto;

import com.yourcompany.talentmanagerapi.entity.ProjectAssignment;

public class ProjectAssignmentDTO {
    private String id;
    private String projectId;
    private String projectName;
    private String role;
    private String startDate;
    private String endDate;
    private int utilizationPercentage;

    public ProjectAssignmentDTO() {
    }

    public static ProjectAssignmentDTO fromEntity(ProjectAssignment assignment) {
        ProjectAssignmentDTO dto = new ProjectAssignmentDTO();
        dto.setId(assignment.getId());
        
        if (assignment.getProject() != null) {
            dto.setProjectId(assignment.getProject().getId());
            dto.setProjectName(assignment.getProject().getName());
        }
        
        dto.setRole(assignment.getRole());
        
        if (assignment.getStartDate() != null) {
            dto.setStartDate(assignment.getStartDate().toString());
        }
        
        if (assignment.getEndDate() != null) {
            dto.setEndDate(assignment.getEndDate().toString());
        }
        
        dto.setUtilizationPercentage(assignment.getUtilizationPercentage());
        
        return dto;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

    public int getUtilizationPercentage() {
        return utilizationPercentage;
    }

    public void setUtilizationPercentage(int utilizationPercentage) {
        this.utilizationPercentage = utilizationPercentage;
    }
}
