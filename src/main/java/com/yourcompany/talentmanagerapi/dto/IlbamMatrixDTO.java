
package com.yourcompany.talentmanagerapi.dto;

import com.yourcompany.talentmanagerapi.entity.IlbamMatrix;

public class IlbamMatrixDTO {
    private String id;
    private String employeeId;
    private int businessUnderstanding;
    private int leadership;
    private int innovationCapability;
    private int teamwork;
    private int adaptability;
    private int motivation;
    private String lastUpdated;
    private String updatedBy;

    public IlbamMatrixDTO() {
    }

    public static IlbamMatrixDTO fromEntity(IlbamMatrix matrix) {
        IlbamMatrixDTO dto = new IlbamMatrixDTO();
        dto.setId(matrix.getId());
        
        if (matrix.getEmployee() != null) {
            dto.setEmployeeId(matrix.getEmployee().getId());
        }
        
        dto.setBusinessUnderstanding(matrix.getBusinessUnderstanding());
        dto.setLeadership(matrix.getLeadership());
        dto.setInnovationCapability(matrix.getInnovationCapability());
        dto.setTeamwork(matrix.getTeamwork());
        dto.setAdaptability(matrix.getAdaptability());
        dto.setMotivation(matrix.getMotivation());
        
        if (matrix.getLastUpdated() != null) {
            dto.setLastUpdated(matrix.getLastUpdated().toString());
        }
        
        dto.setUpdatedBy(matrix.getUpdatedBy());
        
        return dto;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public int getBusinessUnderstanding() {
        return businessUnderstanding;
    }

    public void setBusinessUnderstanding(int businessUnderstanding) {
        this.businessUnderstanding = businessUnderstanding;
    }

    public int getLeadership() {
        return leadership;
    }

    public void setLeadership(int leadership) {
        this.leadership = leadership;
    }

    public int getInnovationCapability() {
        return innovationCapability;
    }

    public void setInnovationCapability(int innovationCapability) {
        this.innovationCapability = innovationCapability;
    }

    public int getTeamwork() {
        return teamwork;
    }

    public void setTeamwork(int teamwork) {
        this.teamwork = teamwork;
    }

    public int getAdaptability() {
        return adaptability;
    }

    public void setAdaptability(int adaptability) {
        this.adaptability = adaptability;
    }

    public int getMotivation() {
        return motivation;
    }

    public void setMotivation(int motivation) {
        this.motivation = motivation;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}
