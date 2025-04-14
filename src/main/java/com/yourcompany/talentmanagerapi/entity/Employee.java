
package com.yourcompany.talentmanagerapi.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.Map;
import java.util.HashMap;

@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
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
    private LocalDate hireDate;
    
    @Enumerated(EnumType.STRING)
    private EmployeeStatus status;
    
    private LocalDate expectedDepartureDate;
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProjectAssignment> projectAssignments = new HashSet<>();
    
    @ElementCollection
    @CollectionTable(name = "employee_competency_matrix", 
                    joinColumns = @JoinColumn(name = "employee_id"))
    @MapKeyColumn(name = "skill_name")
    @Column(name = "skill_rating")
    private Map<String, Integer> competencyMatrix = new HashMap<>();
    
    @ElementCollection
    @CollectionTable(name = "employee_retention_matrix", 
                    joinColumns = @JoinColumn(name = "employee_id"))
    @MapKeyColumn(name = "factor_name")
    @Column(name = "factor_rating")
    private Map<String, Integer> retentionMatrix = new HashMap<>();
    
    @OneToOne(mappedBy = "employee", cascade = CascadeType.ALL)
    private IlbamMatrix ilbamMatrix;
    
    private String notes;

    public Employee() {
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

    public LocalDate getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public EmployeeStatus getStatus() {
        return status;
    }

    public void setStatus(EmployeeStatus status) {
        this.status = status;
    }

    public LocalDate getExpectedDepartureDate() {
        return expectedDepartureDate;
    }

    public void setExpectedDepartureDate(LocalDate expectedDepartureDate) {
        this.expectedDepartureDate = expectedDepartureDate;
    }

    public Set<ProjectAssignment> getProjectAssignments() {
        return projectAssignments;
    }

    public void setProjectAssignments(Set<ProjectAssignment> projectAssignments) {
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

    public IlbamMatrix getIlbamMatrix() {
        return ilbamMatrix;
    }

    public void setIlbamMatrix(IlbamMatrix ilbamMatrix) {
        this.ilbamMatrix = ilbamMatrix;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
