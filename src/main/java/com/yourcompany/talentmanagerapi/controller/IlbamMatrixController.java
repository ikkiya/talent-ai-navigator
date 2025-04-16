
package com.yourcompany.talentmanagerapi.controller;

import com.yourcompany.talentmanagerapi.dto.IlbamMatrixDTO;
import com.yourcompany.talentmanagerapi.entity.Employee;
import com.yourcompany.talentmanagerapi.entity.IlbamMatrix;
import com.yourcompany.talentmanagerapi.service.EmployeeService;
import com.yourcompany.talentmanagerapi.service.IlbamMatrixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ilbam")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class IlbamMatrixController {
    
    @Autowired
    private IlbamMatrixService ilbamMatrixService;
    
    @Autowired
    private EmployeeService employeeService;
    
    @GetMapping
    public ResponseEntity<List<IlbamMatrixDTO>> getAllIlbamMatrices() {
        List<IlbamMatrix> matrices = ilbamMatrixService.getAllIlbamMatrices();
        List<IlbamMatrixDTO> matrixDTOs = matrices.stream()
            .map(IlbamMatrixDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(matrixDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getIlbamMatrixById(@PathVariable String id) {
        Optional<IlbamMatrix> matrixOptional = ilbamMatrixService.getIlbamMatrixById(id);
        if (matrixOptional.isPresent()) {
            IlbamMatrixDTO matrixDTO = IlbamMatrixDTO.fromEntity(matrixOptional.get());
            return ResponseEntity.ok(matrixDTO);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getIlbamMatrixByEmployee(@PathVariable String employeeId) {
        Optional<Employee> employeeOptional = employeeService.getEmployeeById(employeeId);
        if (employeeOptional.isPresent()) {
            Optional<IlbamMatrix> matrixOptional = ilbamMatrixService.getIlbamMatrixByEmployee(employeeOptional.get());
            if (matrixOptional.isPresent()) {
                IlbamMatrixDTO matrixDTO = IlbamMatrixDTO.fromEntity(matrixOptional.get());
                return ResponseEntity.ok(matrixDTO);
            }
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/dateRange")
    public ResponseEntity<List<IlbamMatrixDTO>> getIlbamMatricesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<IlbamMatrix> matrices = ilbamMatrixService.getIlbamMatricesByDateRange(startDate, endDate);
        List<IlbamMatrixDTO> matrixDTOs = matrices.stream()
            .map(IlbamMatrixDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(matrixDTOs);
    }
    
    @GetMapping("/updatedBy/{updatedBy}")
    public ResponseEntity<List<IlbamMatrixDTO>> getIlbamMatricesByUpdatedBy(@PathVariable String updatedBy) {
        List<IlbamMatrix> matrices = ilbamMatrixService.getIlbamMatricesByUpdatedBy(updatedBy);
        List<IlbamMatrixDTO> matrixDTOs = matrices.stream()
            .map(IlbamMatrixDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(matrixDTOs);
    }
    
    @PostMapping
    public ResponseEntity<?> createIlbamMatrix(@RequestBody IlbamMatrix ilbamMatrix) {
        try {
            IlbamMatrix savedMatrix = ilbamMatrixService.saveIlbamMatrix(ilbamMatrix);
            IlbamMatrixDTO matrixDTO = IlbamMatrixDTO.fromEntity(savedMatrix);
            return ResponseEntity.status(HttpStatus.CREATED).body(matrixDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Failed to create ILBAM matrix: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateIlbamMatrix(@PathVariable String id, @RequestBody IlbamMatrix ilbamMatrix) {
        try {
            Optional<IlbamMatrix> matrixOptional = ilbamMatrixService.getIlbamMatrixById(id);
            if (matrixOptional.isPresent()) {
                ilbamMatrix.setId(id);
                IlbamMatrix updatedMatrix = ilbamMatrixService.saveIlbamMatrix(ilbamMatrix);
                IlbamMatrixDTO matrixDTO = IlbamMatrixDTO.fromEntity(updatedMatrix);
                return ResponseEntity.ok(matrixDTO);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Failed to update ILBAM matrix: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIlbamMatrix(@PathVariable String id) {
        try {
            Optional<IlbamMatrix> matrixOptional = ilbamMatrixService.getIlbamMatrixById(id);
            if (matrixOptional.isPresent()) {
                ilbamMatrixService.deleteIlbamMatrix(id);
                return ResponseEntity.ok(Map.of("message", "ILBAM matrix deleted successfully"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to delete ILBAM matrix: " + e.getMessage()));
        }
    }
}
