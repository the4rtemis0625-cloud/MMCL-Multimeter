'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Thermometer } from 'lucide-react';
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

  
  const isLoading = isUserLoading || isReadingLoading || isTempLoading;

  return (
    <div className="grid gap-6 justify-center">
      <Card>
          <CardHeader>
              <CardTitle className="text-center">MMCL Multimeter</CardTitle>
              <CardDescription className="text-center">Live readings from Firebase RTDB.</CardDescription>
          </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="relative w-[500px] h-[500px] md:w-[600px] md:h-[600px]">
            <Image src="/multimeter.png" alt="Multimeter" layout="fill" objectFit="contain" />
            <div className="absolute top-[27%] left-[46%] w-[13%] h-[10%] bg-black/80 rounded-md flex items-center justify-center">
                <p className="text-green-400 font-mono text-sm tracking-widest">
                    {isLoading ? '...' : typeof latestReading === 'number' ? latestReading.toFixed(2) : '0.00'}
                </p>
            </div>
            <div className="absolute top-[49%] left-[29%] w-[10%] h-[11%] bg-black/80 rounded-md flex items-center justify-center">
                <p className="text-orange-400 font-mono text-[8px] tracking-widest">
                    {isLoading ? '...' : typeof latestTemp === 'number' ? latestTemp.toFixed(1) : '0.0'}°C
                </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
