'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import {
  useDatabase,
  useUser,
  initiateAnonymousSignIn,
  useAuth,
  useMemoFirebase,
  useRtdbValue,
} from '@/firebase';
import { ref } from 'firebase/database';

type SimulationMode = 'voltage' | 'ampere';

export default function Dashboard() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const database = useDatabase();
  const [simulatedValue, setSimulatedValue] = useState<number | null>(null);
  const [simulationMode, setSimulationMode] = useState<SimulationMode | null>(null);

  const readingRef = useMemoFirebase(() => (database ? ref(database, 'reading') : null), [database]);
  const tempRef = useMemoFirebase(() => (database ? ref(database, 'Temp') : null), [database]);
  
  const { data: latestReading, isLoading: isReadingLoading } = useRtdbValue<number>(readingRef);
  const { data: latestTemp, isLoading: isTempLoading } = useRtdbValue<number>(tempRef);

  useEffect(() => {
    if (!user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  const handleSimulateVoltage = () => {
    const randomVoltage = Math.random() * 99 + 1;
    setSimulatedValue(randomVoltage);
    setSimulationMode('voltage');
  };

  const handleSimulateAmperage = () => {
    const randomAmperage = Math.random() * 14 + 1;
    setSimulatedValue(randomAmperage);
    setSimulationMode('ampere');
  };
  
  const isLoading = isUserLoading || isReadingLoading || isTempLoading;

  const getDisplayValue = () => {
    if (simulationMode === 'voltage' && simulatedValue !== null) {
      return `${simulatedValue.toFixed(2)} V`;
    }
    if (simulationMode === 'ampere' && simulatedValue !== null) {
      return `${simulatedValue.toFixed(2)} A`;
    }
    if (typeof latestReading === 'number') {
      return `${latestReading.toFixed(2)} V`;
    }
    return '0.00 V';
  };

  return (
    <div className="grid gap-6">
      <Card className="w-full">
          <CardHeader>
              <CardTitle className="text-center">MMCL Multimeter</CardTitle>
              <CardDescription className="text-center">Live readings from Firebase RTDB.</CardDescription>
              <p className="text-center text-xs text-muted-foreground">Readings update automatically every 5 seconds.</p>
          </CardHeader>
        <CardContent className="relative flex flex-col items-center p-6">
          <div className="relative w-full max-w-[800px] aspect-square">
            <Image src="/multimeter.png" alt="Multimeter" fill objectFit="contain" />
            <div className="absolute top-[27%] left-[46%] w-[13%] h-[10%] bg-black/80 rounded-md flex items-center justify-center">
                <p className="text-green-400 font-mono text-[8px] sm:text-xs md:text-sm lg:text-base tracking-widest">
                    {isLoading ? '...' : getDisplayValue()}
                </p>
            </div>
            <div className="absolute top-[49%] left-[29%] w-[10%] h-[11%] bg-black/80 rounded-md flex items-center justify-center">
                <p className="text-orange-400 font-mono text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs tracking-widest">
                    {isLoading ? '...' : typeof latestTemp === 'number' ? `${latestTemp.toFixed(1)} °C` : '0.0 °C'}
                </p>
            </div>
          </div>
          <button onClick={handleSimulateVoltage} className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"></button>
          <button onClick={handleSimulateAmperage} className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"></button>
        </CardContent>
      </Card>
    </div>
  );
}
