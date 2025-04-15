
package com.yourcompany.talentmanagerapi.repository;

import com.yourcompany.talentmanagerapi.entity.Employee;
import com.yourcompany.talentmanagerapi.entity.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByEmployeeId(String employeeId);
    List<Employee> findByStatus(EmployeeStatus status);
    List<Employee> findByDepartment(String department);
    List<Employee> findByManagerId(String managerId);
    List<Employee> findByMentorId(String mentorId);
}
