
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MatrixColumn, MatrixLevel, MATRIX_LEVELS } from '@/types';
import { cn } from '@/lib/utils';

interface FlexibleMatrixTableProps {
  title: string;
  description: string;
  data: Record<string, Record<string, number>>;
  columns: MatrixColumn[];
  employeeIds: string[];
  employeeNames: Record<string, string>;
  levels?: MatrixLevel[];
}

const FlexibleMatrixTable: React.FC<FlexibleMatrixTableProps> = ({
  title,
  description,
  data,
  columns,
  employeeIds,
  employeeNames,
  levels = MATRIX_LEVELS
}) => {
  // If no data, show placeholder
  if (Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 bg-muted/30 border rounded-md">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group columns by category if available
  const columnsByCategory: Record<string, MatrixColumn[]> = {};
  columns.forEach(col => {
    const category = col.category || 'General';
    if (!columnsByCategory[category]) {
      columnsByCategory[category] = [];
    }
    columnsByCategory[category].push(col);
  });

  // Get the color for a score
  const getScoreColor = (score: number) => {
    const level = levels.find(l => l.value === score);
    return level?.color || 'inherit';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table className="border w-full">
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow>
              <TableHead rowSpan={2} className="border">Employee</TableHead>
              {Object.entries(columnsByCategory).map(([category, cols]) => (
                <TableHead 
                  key={category}
                  colSpan={cols.length}
                  className="text-center border"
                >
                  {category !== 'General' ? category : ''}
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              {Object.values(columnsByCategory).flatMap(cols => 
                cols.map(col => (
                  <TableHead key={col.key} className="text-center border px-2 py-1 whitespace-nowrap">
                    {col.label}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeeIds.map(empId => {
              const employeeData = data[empId] || {};
              return (
                <TableRow key={empId}>
                  <TableCell className="font-medium border">
                    {employeeNames[empId] || empId}
                  </TableCell>
                  {Object.values(columnsByCategory).flatMap(cols => 
                    cols.map(col => {
                      const score = employeeData[col.key] || 0;
                      const color = getScoreColor(score);
                      return (
                        <TableCell 
                          key={`${empId}-${col.key}`} 
                          className="text-center border p-0"
                        >
                          {score > 0 && (
                            <div 
                              className="w-full h-full py-2"
                              style={{ 
                                backgroundColor: color,
                                color: score === 3 ? 'black' : 'white'
                              }}
                            >
                              {score}
                            </div>
                          )}
                        </TableCell>
                      );
                    })
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="mt-6">
          <h4 className="font-medium mb-2">Legend</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {levels.map(level => (
              <div 
                key={level.value}
                className="flex items-center gap-2 p-2 rounded border"
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ 
                    backgroundColor: level.color,
                    color: level.value === 3 ? 'black' : 'white'
                  }}
                >
                  {level.value}
                </div>
                <div>
                  <div className="font-medium">{level.label}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{level.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlexibleMatrixTable;
