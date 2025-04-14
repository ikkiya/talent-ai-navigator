import React from 'react';
import Layout from '@/components/Layout';
import { api } from '@/backend/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Employee } from '@/types';
import { useQuery } from '@tanstack/react-query';

const Employees = () => {
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
  });

  const totalEmployees = employees?.length || 0;

  const departmentCount = employees?.reduce((acc, employee) => {
    acc[employee.department] = (acc[employee.department] || 0) + 1;
    return acc;
  }, {}) || {};

  const departmentList = Object.keys(departmentCount).map(dept => ({
    name: dept,
    count: departmentCount[dept],
  }));

  const locationCount = employees?.reduce((acc, employee) => {
    acc[employee.location] = (acc[employee.location] || 0) + 1;
    return acc;
  }, {}) || {};

  const locationList = Object.keys(locationCount).map(location => ({
    name: location,
    count: locationCount[location],
  }));

  const statusCount = employees?.reduce((acc, employee) => {
    acc[employee.status] = (acc[employee.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const statusList = Object.keys(statusCount).map(status => ({
    name: status,
    count: statusCount[status],
  }));

  const calculateAverageRetentionRisk = (employee: Employee): number => {
    if (!employee.retentionMatrix) return 0;
    const values = Object.values(employee.retentionMatrix);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const getRiskLevel = (avgScore: number): string => {
    if (avgScore <= 2) return 'High Risk';
    if (avgScore <= 3) return 'Medium Risk';
    return 'Low Risk';
  };

  const getRiskColor = (avgScore: number): string => {
    if (avgScore <= 2) return 'red';
    if (avgScore <= 3) return 'yellow';
    return 'green';
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    const riskA = calculateAverageRetentionRisk(a);
    const riskB = calculateAverageRetentionRisk(b);
    return riskA - riskB;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div>Loading employees data...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your team and view employee details.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Employees</CardTitle>
              <CardDescription>All employees in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Number of employees per department</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-2">
                {departmentList.map(dept => (
                  <li key={dept.name} className="flex items-center justify-between">
                    <span>{dept.name}</span>
                    <span className="font-medium">{dept.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Distribution</CardTitle>
              <CardDescription>Number of employees per location</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-2">
                {locationList.map(location => (
                  <li key={location.name} className="flex items-center justify-between">
                    <span>{location.name}</span>
                    <span className="font-medium">{location.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Number of employees per status</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-2">
                {statusList.map(status => (
                  <li key={status.name} className="flex items-center justify-between">
                    <span>{status.name}</span>
                    <span className="font-medium">{status.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
            <CardDescription>A list of all employees sorted by retention risk</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Retention Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEmployees.map((employee) => {
                  const avgRisk = calculateAverageRetentionRisk(employee);
                  const riskLevel = getRiskLevel(avgRisk);
                  const riskColor = getRiskColor(avgRisk);

                  return (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={`https://avatar.vercel.sh/${employee.email}.png`} alt={employee.firstName} />
                            <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                            <div className="text-xs text-muted-foreground">{employee.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.location}</TableCell>
                      <TableCell>{employee.status}</TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: riskColor, color: 'white' }}>
                          {riskLevel}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Employees;
