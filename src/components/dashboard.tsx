'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestTube2, Loader2, Thermometer } from 'lucide-react';
import Image from 'next/image';
import {
  useDatabase,
  useUser,
  initiateAnonymousSignIn,
  useAuth,
  useMemoFirebase,
  useRtdbValue,
} from '@/firebase';
import { ref, set } from 'firebase/database';

const getRandom = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

export default function Dashboard() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const database = useDatabase();

  const readingRef = useMemoFirebase(() => (database ? ref(database, 'reading') : null), [database]);
  const tempRef = useMemoFirebase(() => (database ? ref(database, 'temperature') : null), [database]);
  
  const { data: latestReading, isLoading: isReadingLoading } = useRtdbValue<number>(readingRef);
  const { data: latestTemp, isLoading: isTempLoading } = useRtdbValue<number>(tempRef);

  useEffect(() => {
    if (!user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  const simulateNewReading = () => {
    if (!user || !database || !readingRef) return;
    const newReading = getRandom(1.8, 3.5);
    set(readingRef, newReading);
  };

  const simulateNewTemp = () => {
    if (!user || !database || !tempRef) return;
    const newTemp = getRandom(18, 25);
    set(tempRef, newTemp);
  };
  
  const isLoading = isUserLoading || isReadingLoading || isTempLoading;

  return (
    <div className="grid gap-6 justify-center">
      <Card>
          <CardHeader>
              <CardTitle className="text-center">MMCL Multimeter</CardTitle>
              <CardDescription className="text-center">Live readings from Firebase RTDB.</CardDescription>
          </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
            <Image src="/multimeter.png" alt="Multimeter" layout="fill" objectFit="contain" />
            <div className="absolute top-[27%] left-[46%] w-[13%] h-[10%] bg-black/80 rounded-md flex items-center justify-center">
                <p className="text-green-400 font-mono text-xs tracking-widest">
                    {isLoading ? '...' : latestReading ? latestReading.toFixed(2) : '0.00'}
                </p>
            </div>
            <div className="absolute top-[49%] left-[29%] w-[10%] h-[11%] bg-black/80 rounded-md flex items-center justify-center">
                <p className="text-orange-400 font-mono text-[10px] tracking-widest">
                    {isLoading ? '...' : latestTemp ? latestTemp.toFixed(1) : '0.0'}°C
                </p>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <Button onClick={simulateNewReading} disabled={isLoading || !user}>
              {isReadingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube2 className="mr-2 h-4 w-4" />}
              {isLoading ? 'Connecting...' : 'Simulate Reading'}
            </Button>
            <Button onClick={simulateNewTemp} disabled={isLoading || !user} variant="outline">
              {isTempLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Thermometer className="mr-2 h-4 w-4" />}
              {isLoading ? 'Connecting...' : 'Simulate Temp'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    