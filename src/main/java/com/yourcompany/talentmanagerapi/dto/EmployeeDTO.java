
package com.yourcompany.talentmanagerapi.dto;

import com.yourcompany.talentmanagerapi.entity.Employee;
import com.yourcompany.talentmanagerapi.entity.EmployeeStatus;
import com.yourcompany.talentmanagerapi.entity.IlbamMatrix;
import com.yourcompany.talentmanagerapi.entity.ProjectAssignment;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class EmployeeDTO {
    private String id;
    private String employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private String position;
    private String location;
    private String managerId;
    private String mentorId;
    private String hireDate;
    private EmployeeStatus status;
    private String expectedDepartureDate;
    private List<ProjectAssignmentDTO> projectAssignments = new ArrayList<>();
    private Map<String, Integer> competencyMatrix = new HashMap<>();
    private Map<String, Integer> retentionMatrix = new HashMap<>();
    private IlbamMatrixDTO ilbamMatrix;
    private String notes;

    public EmployeeDTO() {
    }

    public static EmployeeDTO fromEntity(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setEmployeeId(employee.getEmployeeId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setDepartment(employee.getDepartment());
        dto.setPosition(employee.getPosition());
        dto.setLocation(employee.getLocation());
        dto.setManagerId(employee.getManagerId());
        dto.setMentorId(employee.getMentorId());
        dto.setStatus(employee.getStatus());
        dto.setNotes(employee.getNotes());
        
        if (employee.getHireDate() != null) {
            dto.setHireDate(employee.getHireDate().toString());
        }
        
        if (employee.getExpectedDepartureDate() != null) {
            dto.setExpectedDepartureDate(employee.getExpectedDepartureDate().toString());
        }
        
        // Convert project assignments
        dto.setProjectAssignments(employee.getProjectAssignments().stream()
                .map(ProjectAssignmentDTO::fromEntity)
                .collect(Collectors.toList()));
        
        // Copy matrices
        if (employee.getCompetencyMatrix() != null) {
            dto.setCompetencyMatrix(new HashMap<>(employee.getCompetencyMatrix()));
        }
        
        if (employee.getRetentionMatrix() != null) {
            dto.setRetentionMatrix(new HashMap<>(employee.getRetentionMatrix()));
        }
        
        // Convert ILBAM matrix if present
        if (employee.getIlbamMatrix() != null) {
            dto.setIlbamMatrix(IlbamMatrixDTO.fromEntity(employee.getIlbamMatrix()));
        }
        
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

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getManagerId() {
        return managerId;
    }

    public void setManagerId(String managerId) {
        this.managerId = managerId;
    }

    public String getMentorId() {
        return mentorId;
    }

    public void setMentorId(String mentorId) {
        this.mentorId = mentorId;
    }

    public String getHireDate() {
        return hireDate;
    }

    public void setHireDate(String hireDate) {
        this.hireDate = hireDate;
    }

    public EmployeeStatus getStatus() {
        return status;
    }

    public void setStatus(EmployeeStatus status) {
        this.status = status;
    }

    public String getExpectedDepartureDate() {
        return expectedDepartureDate;
    }

    public void setExpectedDepartureDate(String expectedDepartureDate) {
        this.expectedDepartureDate = expectedDepartureDate;
    }

    public List<ProjectAssignmentDTO> getProjectAssignments() {
        return projectAssignments;
    }

    public void setProjectAssignments(List<ProjectAssignmentDTO> projectAssignments) {
        this.projectAssignments = projectAssignments;
    }

    public Map<String, Integer> getCompetencyMatrix() {
        return competencyMatrix;
    }

    public void setCompetencyMatrix(Map<String, Integer> competencyMatrix) {
        this.competencyMatrix = competencyMatrix;
    }

    public Map<String, Integer> getRetentionMatrix() {
        return retentionMatrix;
    }

    public void setRetentionMatrix(Map<String, Integer> retentionMatrix) {
        this.retentionMatrix = retentionMatrix;
    }

    public IlbamMatrixDTO getIlbamMatrix() {
        return ilbamMatrix;
    }

    public void setIlbamMatrix(IlbamMatrixDTO ilbamMatrix) {
        this.ilbamMatrix = ilbamMatrix;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
