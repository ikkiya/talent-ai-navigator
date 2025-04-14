import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/backend/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye, BarChart4 } from 'lucide-react';
import { IlbamMatrix, Employee } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface IlbamMatrixTableProps {
  employees: Employee[];
  onEdit: (matrix: IlbamMatrix, employee: Employee) => void;
  onView: (matrix: IlbamMatrix, employee: Employee) => void;
}

const IlbamMatrixTable: React.FC<IlbamMatrixTableProps> = ({ employees, onEdit, onView }) => {
  const { auth } = useAuth();
  const isAdmin = auth.user?.role === 'admin';
  
  const { data: matrices = [], isLoading } = useQuery({
    queryKey: ['ilbam-matrices'],
    queryFn: api.ilbam.getAll,
  });
  
  const matricesByEmployeeId = matrices.reduce((acc, matrix) => {
    acc[matrix.employeeId] = matrix;
    return acc;
  }, {} as Record<string, IlbamMatrix>);
  
  const employeesWithMatrices = employees.filter(
    (employee) => employee.id in matricesByEmployeeId
  );
  
  const calculateAverage = (matrix: IlbamMatrix): number => {
    const scores = [
      matrix.businessUnderstanding,
      matrix.leadership,
      matrix.innovationCapability,
      matrix.teamwork,
      matrix.adaptability,
      matrix.motivation
    ];
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ILBAM Matrices</CardTitle>
          <CardDescription>Loading ILBAM matrices data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (employeesWithMatrices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ILBAM Matrices</CardTitle>
          <CardDescription>No ILBAM matrices available yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart4 className="mr-2 h-5 w-5 text-primary" />
          ILBAM Matrices
        </CardTitle>
        <CardDescription>
          View and manage ILBAM matrices for employees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Business Understanding</TableHead>
              <TableHead>Leadership</TableHead>
              <TableHead>Innovation</TableHead>
              <TableHead>Teamwork</TableHead>
              <TableHead>Adaptability</TableHead>
              <TableHead>Motivation</TableHead>
              <TableHead>Average</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeesWithMatrices.map((employee) => {
              const matrix = matricesByEmployeeId[employee.id];
              const avgScore = calculateAverage(matrix);
              
              return (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">{employee.position}</div>
                  </TableCell>
                  <TableCell>{matrix.businessUnderstanding}</TableCell>
                  <TableCell>{matrix.leadership}</TableCell>
                  <TableCell>{matrix.innovationCapability}</TableCell>
                  <TableCell>{matrix.teamwork}</TableCell>
                  <TableCell>{matrix.adaptability}</TableCell>
                  <TableCell>{matrix.motivation}</TableCell>
                  <TableCell>
                    <Badge variant={avgScore >= 4 ? "default" : avgScore >= 3 ? "outline" : "destructive"}>
                      {avgScore.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(matrix.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(matrix, employee)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(matrix, employee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default IlbamMatrixTable;
