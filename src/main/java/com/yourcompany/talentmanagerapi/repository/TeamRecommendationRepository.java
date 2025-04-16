
package com.yourcompany.talentmanagerapi.repository;

import com.yourcompany.talentmanagerapi.entity.Project;
import com.yourcompany.talentmanagerapi.entity.TeamRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRecommendationRepository extends JpaRepository<TeamRecommendation, String> {
    List<TeamRecommendation> findByProject(Project project);
    Optional<TeamRecommendation> findByProject_Id(String projectId);
    List<TeamRecommendation> findByConfidenceScoreGreaterThan(int confidenceScoreThreshold);
}
