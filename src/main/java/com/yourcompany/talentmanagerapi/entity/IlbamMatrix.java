
package com.yourcompany.talentmanagerapi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ilbam_matrices")
public class IlbamMatrix {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @OneToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    
    private int businessUnderstanding;
    private int leadership;
    private int innovationCapability;
    private int teamwork;
    private int adaptability;
    private int motivation;
    private LocalDateTime lastUpdated;
    private String updatedBy;

    public IlbamMatrix() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getEmployeeId() {
        return employee != null ? employee.getId() : null;
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

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}
