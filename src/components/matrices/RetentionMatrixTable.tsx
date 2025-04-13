
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RETENTION_RISK_LEVELS } from '@/types';
import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

interface RetentionMatrixTableProps {
  data: Record<string, Record<string, number>>;
  employeeNames: Record<string, string>;
  columns: Array<{ key: string; label: string }>;
}

const RetentionMatrixTable: React.FC<RetentionMatrixTableProps> = ({
  data,
  employeeNames,
  columns,
}) => {
  if (Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Retention Matrix</CardTitle>
          <CardDescription>Employee retention risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 bg-muted/30 border rounded-md">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-2">No retention data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine risk level
  const getRiskLevel = (score: number) => {
    if (score >= 4) return RETENTION_RISK_LEVELS.low;
    if (score >= 2) return RETENTION_RISK_LEVELS.medium;
    return RETENTION_RISK_LEVELS.high;
  };

  // Get icon for risk level
  const getRiskIcon = (score: number) => {
    if (score >= 4) return <CheckCircle2 className="w-4 h-4" />;
    if (score >= 2) return <AlertCircle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  // Calculate average risk for an employee
  const calculateOverallRisk = (employeeData: Record<string, number>) => {
    const values = Object.values(employeeData);
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  // Sort employees by risk level (highest risk first)
  const sortedEmployees = Object.keys(data).sort((a, b) => {
    const riskA = calculateOverallRisk(data[a]);
    const riskB = calculateOverallRisk(data[b]);
    return riskA - riskB; // Lower scores (higher risk) first
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retention Matrix</CardTitle>
        <CardDescription>Employee retention risk assessment</CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table className="border">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="border">Employee</TableHead>
              {columns.map(col => (
                <TableHead key={col.key} className="text-center border whitespace-nowrap">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="text-center border">Overall Risk</TableHead>
              <TableHead className="text-center border">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmployees.map(empId => {
              const employeeData = data[empId] || {};
              const overallRisk = calculateOverallRisk(employeeData);
              const riskLevel = getRiskLevel(overallRisk);
              
              return (
                <TableRow key={empId}>
                  <TableCell className="font-medium border">
                    {employeeNames[empId] || empId}
                  </TableCell>
                  {columns.map(col => {
                    const score = employeeData[col.key] || 0;
                    const riskLevel = getRiskLevel(score);
                    return (
                      <TableCell 
                        key={`${empId}-${col.key}`} 
                        className="text-center border p-0"
                      >
                        {score > 0 && (
                          <div 
                            className="flex items-center justify-center w-full h-full py-2 gap-1"
                            style={{ backgroundColor: riskLevel.color }}
                          >
                            {getRiskIcon(score)}
                            <span>{score}</span>
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell 
                    className="text-center border font-medium" 
                    style={{ backgroundColor: riskLevel.color }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {getRiskIcon(overallRisk)}
                      <span>{overallRisk.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="border">
                    {overallRisk < 2.5 && (
                      <span className="text-sm">Risque de démission élevé</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="mt-6">
          <h4 className="font-medium mb-2">Legend</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {Object.values(RETENTION_RISK_LEVELS).map(level => (
              <div 
                key={level.value}
                className="flex items-center gap-2 p-2 rounded border"
                style={{ backgroundColor: level.color }}
              >
                <div className="font-medium">{level.label}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetentionMatrixTable;
