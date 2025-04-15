
package com.yourcompany.talentmanagerapi.repository;

import com.yourcompany.talentmanagerapi.entity.Project;
import com.yourcompany.talentmanagerapi.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByStartDateBetween(LocalDate startDate, LocalDate endDate);
    List<Project> findByEndDateBetween(LocalDate startDate, LocalDate endDate);
    List<Project> findByNameContainingIgnoreCase(String name);
}
