
package com.yourcompany.talentmanagerapi.service;

import com.yourcompany.talentmanagerapi.entity.Employee;
import com.yourcompany.talentmanagerapi.entity.EmployeeStatus;
import com.yourcompany.talentmanagerapi.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    
    public Optional<Employee> getEmployeeById(String id) {
        return employeeRepository.findById(id);
    }
    
    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }
    
    public Optional<Employee> getEmployeeByEmployeeId(String employeeId) {
        return employeeRepository.findByEmployeeId(employeeId);
    }
    
    public List<Employee> getEmployeesByStatus(EmployeeStatus status) {
        return employeeRepository.findByStatus(status);
    }
    
    public List<Employee> getEmployeesByDepartment(String department) {
        return employeeRepository.findByDepartment(department);
    }
    
    public List<Employee> getEmployeesByManagerId(String managerId) {
        return employeeRepository.findByManagerId(managerId);
    }
    
    public List<Employee> getEmployeesByMentorId(String mentorId) {
        return employeeRepository.findByMentorId(mentorId);
    }
    
    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }
    
    public void deleteEmployee(String id) {
        employeeRepository.deleteById(id);
    }
    
    public List<Employee> saveAllEmployees(List<Employee> employees) {
        return employeeRepository.saveAll(employees);
    }
}
