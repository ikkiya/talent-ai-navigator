
package com.yourcompany.talentmanagerapi.repository;

import com.yourcompany.talentmanagerapi.entity.Employee;
import com.yourcompany.talentmanagerapi.entity.IlbamMatrix;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IlbamMatrixRepository extends JpaRepository<IlbamMatrix, String> {
    Optional<IlbamMatrix> findByEmployee(Employee employee);
    List<IlbamMatrix> findByLastUpdatedBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<IlbamMatrix> findByUpdatedBy(String updatedBy);
}
