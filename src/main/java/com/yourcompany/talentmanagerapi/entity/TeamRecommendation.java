
package com.yourcompany.talentmanagerapi.entity;

import jakarta.persistence.*;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "team_recommendations")
public class TeamRecommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    
    @ManyToMany
    @JoinTable(
        name = "recommendation_employees",
        joinColumns = @JoinColumn(name = "recommendation_id"),
        inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private Set<Employee> recommendedEmployees = new HashSet<>();
    
    @ElementCollection
    @CollectionTable(name = "recommendation_reasonings", 
                    joinColumns = @JoinColumn(name = "recommendation_id"))
    @MapKeyJoinColumn(name = "employee_id")
    @Column(name = "reasoning")
    private Map<String, String> reasonings = new HashMap<>();
    
    @ManyToMany
    @JoinTable(
        name = "recommendation_alternatives",
        joinColumns = @JoinColumn(name = "recommendation_id"),
        inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private Set<Employee> alternativeEmployees = new HashSet<>();
    
    private int confidenceScore;

    public TeamRecommendation() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getProjectId() {
        return project != null ? project.getId() : null;
    }

    public Set<Employee> getRecommendedEmployees() {
        return recommendedEmployees;
    }

    public void setRecommendedEmployees(Set<Employee> recommendedEmployees) {
        this.recommendedEmployees = recommendedEmployees;
    }

    public Map<String, String> getReasonings() {
        return reasonings;
    }

    public void setReasonings(Map<String, String> reasonings) {
        this.reasonings = reasonings;
    }

    public Set<Employee> getAlternativeEmployees() {
        return alternativeEmployees;
    }

    public void setAlternativeEmployees(Set<Employee> alternativeEmployees) {
        this.alternativeEmployees = alternativeEmployees;
    }

    public int getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(int confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
}
