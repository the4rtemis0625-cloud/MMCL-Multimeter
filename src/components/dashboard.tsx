'use client';

import { useState, useMemo, useEffect } from 'react';
import { type Reading, type Anomaly } from '@/types';
import { generateMockReadings } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestTube2 } from 'lucide-react';
import Image from 'next/image';

const getRandom = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

export default function Dashboard() {
  const [reading, setReading] = useState<Reading | null>(null);

  useEffect(() => {
    // Set initial reading on mount
    setReading({
        id: 0,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        voltage: getRandom(4.8, 5.2),
        current: getRandom(1.8, 2.2),
        resistance: getRandom(95, 105),
    });
  }, []);


  const simulateNewReading = () => {
    const newReading: Reading = {
        id: reading ? reading.id + 1 : 0,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        voltage: getRandom(4.8, 7.0),
        current: getRandom(1.8, 3.5),
        resistance: getRandom(95, 150),
    };
    setReading(newReading);
  };

  return (
    <div className="grid gap-6 justify-center">
      <Card>
          <CardHeader>
              <CardTitle className="text-center">MMCL Multimeter Simulation</CardTitle>
              <CardDescription className="text-center">Click the button to simulate a new reading.</CardDescription>
          </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
            <Image src="/multimeter.png" alt="Multimeter" layout="fill" objectFit="contain" />
            <div className="absolute top-[37%] left-[26%] w-[48%] h-[15%] bg-black/80 rounded-md flex items-center justify-center">
                <p className="text-green-400 font-mono text-3xl md:text-5xl tracking-widest">
                    {reading ? reading.current.toFixed(2) : '0.00'}
                </p>
            </div>
          </div>
          <Button onClick={simulateNewReading} className="mt-8">
            <TestTube2 className="mr-2 h-4 w-4" />
            Simulate Reading
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
