
package com.yourcompany.talentmanagerapi.controller;

import com.yourcompany.talentmanagerapi.dto.EmployeeDTO;
import com.yourcompany.talentmanagerapi.entity.Employee;
import com.yourcompany.talentmanagerapi.entity.EmployeeStatus;
import com.yourcompany.talentmanagerapi.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class EmployeeController {
    
    @Autowired
    private EmployeeService employeeService;
    
    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        List<EmployeeDTO> employeeDTOs = employees.stream()
            .map(EmployeeDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(employeeDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable String id) {
        Optional<Employee> employeeOptional = employeeService.getEmployeeById(id);
        if (employeeOptional.isPresent()) {
            EmployeeDTO employeeDTO = EmployeeDTO.fromEntity(employeeOptional.get());
            return ResponseEntity.ok(employeeDTO);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getEmployeeByEmail(@PathVariable String email) {
        Optional<Employee> employeeOptional = employeeService.getEmployeeByEmail(email);
        if (employeeOptional.isPresent()) {
            EmployeeDTO employeeDTO = EmployeeDTO.fromEntity(employeeOptional.get());
            return ResponseEntity.ok(employeeDTO);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/employeeId/{employeeId}")
    public ResponseEntity<?> getEmployeeByEmployeeId(@PathVariable String employeeId) {
        Optional<Employee> employeeOptional = employeeService.getEmployeeByEmployeeId(employeeId);
        if (employeeOptional.isPresent()) {
            EmployeeDTO employeeDTO = EmployeeDTO.fromEntity(employeeOptional.get());
            return ResponseEntity.ok(employeeDTO);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByStatus(@PathVariable String status) {
        try {
            EmployeeStatus employeeStatus = EmployeeStatus.valueOf(status);
            List<Employee> employees = employeeService.getEmployeesByStatus(employeeStatus);
            List<EmployeeDTO> employeeDTOs = employees.stream()
                .map(EmployeeDTO::fromEntity)
                .collect(Collectors.toList());
            return ResponseEntity.ok(employeeDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/department/{department}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByDepartment(@PathVariable String department) {
        List<Employee> employees = employeeService.getEmployeesByDepartment(department);
        List<EmployeeDTO> employeeDTOs = employees.stream()
            .map(EmployeeDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(employeeDTOs);
    }
    
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByManagerId(@PathVariable String managerId) {
        List<Employee> employees = employeeService.getEmployeesByManagerId(managerId);
        List<EmployeeDTO> employeeDTOs = employees.stream()
            .map(EmployeeDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(employeeDTOs);
    }
    
    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByMentorId(@PathVariable String mentorId) {
        List<Employee> employees = employeeService.getEmployeesByMentorId(mentorId);
        List<EmployeeDTO> employeeDTOs = employees.stream()
            .map(EmployeeDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(employeeDTOs);
    }
    
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {
        try {
            Employee savedEmployee = employeeService.saveEmployee(employee);
            EmployeeDTO employeeDTO = EmployeeDTO.fromEntity(savedEmployee);
            return ResponseEntity.status(HttpStatus.CREATED).body(employeeDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Failed to create employee: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable String id, @RequestBody Employee employee) {
        try {
            Optional<Employee> employeeOptional = employeeService.getEmployeeById(id);
            if (employeeOptional.isPresent()) {
                employee.setId(id);
                Employee updatedEmployee = employeeService.saveEmployee(employee);
                EmployeeDTO employeeDTO = EmployeeDTO.fromEntity(updatedEmployee);
                return ResponseEntity.ok(employeeDTO);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Failed to update employee: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        try {
            Optional<Employee> employeeOptional = employeeService.getEmployeeById(id);
            if (employeeOptional.isPresent()) {
                employeeService.deleteEmployee(id);
                return ResponseEntity.ok(Map.of("message", "Employee deleted successfully"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to delete employee: " + e.getMessage()));
        }
    }
}
