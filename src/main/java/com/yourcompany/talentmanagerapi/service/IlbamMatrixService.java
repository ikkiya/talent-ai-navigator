
package com.yourcompany.talentmanagerapi.service;

import com.yourcompany.talentmanagerapi.entity.Employee;
import com.yourcompany.talentmanagerapi.entity.IlbamMatrix;
import com.yourcompany.talentmanagerapi.repository.IlbamMatrixRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class IlbamMatrixService {
    
    @Autowired
    private IlbamMatrixRepository ilbamMatrixRepository;
    
    public List<IlbamMatrix> getAllIlbamMatrices() {
        return ilbamMatrixRepository.findAll();
    }
    
    public Optional<IlbamMatrix> getIlbamMatrixById(String id) {
        return ilbamMatrixRepository.findById(id);
    }
    
    public Optional<IlbamMatrix> getIlbamMatrixByEmployee(Employee employee) {
        return ilbamMatrixRepository.findByEmployee(employee);
    }
    
    public List<IlbamMatrix> getIlbamMatricesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return ilbamMatrixRepository.findByLastUpdatedBetween(startDate, endDate);
    }
    
    public List<IlbamMatrix> getIlbamMatricesByUpdatedBy(String updatedBy) {
        return ilbamMatrixRepository.findByUpdatedBy(updatedBy);
    }
    
    public IlbamMatrix saveIlbamMatrix(IlbamMatrix ilbamMatrix) {
        ilbamMatrix.setLastUpdated(LocalDateTime.now());
        return ilbamMatrixRepository.save(ilbamMatrix);
    }
    
    public void deleteIlbamMatrix(String id) {
        ilbamMatrixRepository.deleteById(id);
    }
    
    public List<IlbamMatrix> saveAllIlbamMatrices(List<IlbamMatrix> matrices) {
        matrices.forEach(matrix -> matrix.setLastUpdated(LocalDateTime.now()));
        return ilbamMatrixRepository.saveAll(matrices);
    }
}
