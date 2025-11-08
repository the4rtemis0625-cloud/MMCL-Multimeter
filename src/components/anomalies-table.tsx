'use client';

import { type Anomaly } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface AnomaliesTableProps {
  anomalies: Anomaly[];
}

export default function AnomaliesTable({ anomalies }: AnomaliesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Anomaly Report
        </CardTitle>
        <CardDescription>
          Listing all readings that exceeded the specified thresholds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {anomalies.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Reading Type</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anomalies.map((anomaly) => (
                  <TableRow key={anomaly.id} className="hover:bg-destructive/5">
                    <TableCell className="font-mono text-xs">{anomaly.timestamp}</TableCell>
                    <TableCell>{anomaly.type}</TableCell>
                    <TableCell className="text-right font-semibold text-destructive">
                      {anomaly.value.toFixed(2)} {anomaly.type === 'Voltage' ? 'V' : anomaly.type === 'Current' ? 'A' : 'Ω'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-border p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h3 className="text-xl font-semibold">All Systems Nominal</h3>
            <p className="text-muted-foreground">No anomalies detected based on the current thresholds.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
