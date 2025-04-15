
package com.yourcompany.talentmanagerapi.repository;

import com.yourcompany.talentmanagerapi.entity.Employee;
import com.yourcompany.talentmanagerapi.entity.Project;
import com.yourcompany.talentmanagerapi.entity.ProjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, String> {
    List<ProjectAssignment> findByEmployee(Employee employee);
    List<ProjectAssignment> findByProject(Project project);
    List<ProjectAssignment> findByEmployeeAndProject(Employee employee, Project project);
    List<ProjectAssignment> findByStartDateBetween(LocalDate startDate, LocalDate endDate);
    List<ProjectAssignment> findByEndDateBetween(LocalDate startDate, LocalDate endDate);
    List<ProjectAssignment> findByRole(String role);
}
