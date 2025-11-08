'use client';

import { useState, useMemo } from 'react';
import { type Reading, type Anomaly } from '@/types';
import { generateMockReadings } from '@/lib/data';
import DataUploader from './data-uploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReadingChart from './reading-chart';
import AnomaliesTable from './anomalies-table';
import { Zap, Waves, Omega, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [thresholds, setThresholds] = useState({
    voltage: 5.5,
    current: 2.5,
    resistance: 120,
  });
  const { toast } = useToast();

  const handleDataLoaded = (data: Reading[]) => {
    setReadings(data);
    toast({
      title: "Data Processed",
      description: `${data.length} readings have been loaded successfully.`,
    });
  };

  const handleThresholdChange = (type: keyof typeof thresholds, value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setThresholds(prev => ({ ...prev, [type]: numericValue }));
    } else if (value === '') {
        setThresholds(prev => ({...prev, [type]: 0}));
    }
  };

  const anomalies = useMemo((): Anomaly[] => {
    if (readings.length === 0) return [];
    
    const foundAnomalies: Anomaly[] = [];
    readings.forEach(reading => {
      if (reading.voltage > thresholds.voltage) {
        foundAnomalies.push({ id: reading.id, timestamp: reading.timestamp, type: 'Voltage', value: reading.voltage });
      }
      if (reading.current > thresholds.current) {
        foundAnomalies.push({ id: reading.id + readings.length, timestamp: reading.timestamp, type: 'Current', value: reading.current });
      }
      if (reading.resistance > thresholds.resistance) {
        foundAnomalies.push({ id: reading.id + readings.length * 2, timestamp: reading.timestamp, type: 'Resistance', value: reading.resistance });
      }
    });
    return foundAnomalies.sort((a, b) => a.id - b.id);
  }, [readings, thresholds]);

  return (
    <div className="grid gap-6">
      <DataUploader onDataLoaded={handleDataLoaded} generateData={() => generateMockReadings(100)} />
      
      {readings.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Threshold Settings</CardTitle>
              <CardDescription>Set the maximum values. Readings above these will be flagged as anomalies.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="voltage-threshold" className="flex items-center gap-2"><Zap className="h-4 w-4" />Voltage (V)</Label>
                <Input id="voltage-threshold" type="number" value={thresholds.voltage} onChange={(e) => handleThresholdChange('voltage', e.target.value)} placeholder="e.g. 5.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-threshold" className="flex items-center gap-2"><Waves className="h-4 w-4" />Current (A)</Label>
                <Input id="current-threshold" type="number" value={thresholds.current} onChange={(e) => handleThresholdChange('current', e.target.value)} placeholder="e.g. 2.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resistance-threshold" className="flex items-center gap-2"><Omega className="h-4 w-4" />Resistance (Ω)</Label>
                <Input id="resistance-threshold" type="number" value={thresholds.resistance} onChange={(e) => handleThresholdChange('resistance', e.target.value)} placeholder="e.g. 120" />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="visualization" className="w-full">
            <div className="flex justify-between items-end">
              <TabsList>
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="anomalies" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Anomalies 
                  {anomalies.length > 0 && <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{anomalies.length}</span>}
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="visualization" className="mt-4">
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                <ReadingChart data={readings} dataKey="voltage" color="var(--chart-1)" title="Voltage" unit="V" icon={Zap} />
                <ReadingChart data={readings} dataKey="current" color="var(--chart-2)" title="Current" unit="A" icon={Waves} />
                <ReadingChart data={readings} dataKey="resistance" color="var(--chart-4)" title="Resistance" unit="Ω" icon={Omega} />
              </div>
            </TabsContent>
            <TabsContent value="anomalies" className="mt-4">
              <AnomaliesTable anomalies={anomalies} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
         <Card className="flex flex-col items-center justify-center py-20">
            <CardContent className="text-center">
                <h3 className="text-xl font-semibold text-muted-foreground">No data loaded</h3>
                <p className="text-muted-foreground mt-2">Upload a file or generate sample data to begin analysis.</p>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
