'use client';

import { useState, useMemo, useEffect } from 'react';
import { type Reading } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestTube2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import {
  useFirestore,
  useCollection,
  useUser,
  initiateAnonymousSignIn,
  useAuth,
  useMemoFirebase,
  addDocumentNonBlocking,
} from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

const getRandom = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

export default function Dashboard() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const readingsCollRef = useMemoFirebase(() => collection(firestore, 'readings'), [firestore]);
  const readingsQuery = useMemoFirebase(() => query(readingsCollRef, orderBy('timestamp', 'desc'), limit(1)), [readingsCollRef]);
  
  const { data: readings, isLoading: isReadingsLoading } = useCollection<Reading>(readingsQuery);
  const latestReading = readings?.[0] || null;

  useEffect(() => {
    if (!user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  const simulateNewReading = () => {
    if (!user || !firestore) return;
    const newReading = {
        timestamp: new Date(),
        voltage: getRandom(4.8, 7.0),
        current: getRandom(1.8, 3.5),
        resistance: getRandom(95, 150),
    };
    addDocumentNonBlocking(readingsCollRef, newReading);
  };
  
  const isLoading = isUserLoading || isReadingsLoading;

  return (
    <div className="grid gap-6 justify-center">
      <Card>
          <CardHeader>
              <CardTitle className="text-center">MMCL Multimeter</CardTitle>
              <CardDescription className="text-center">Live readings from Firebase Firestore.</CardDescription>
          </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
            <Image src="/multimeter.png" alt="Multimeter" layout="fill" objectFit="contain" />
            <div className="absolute top-[27%] left-[46%] w-[13%] h-[10%] bg-black/80 rounded-md flex items-center justify-center">
                <p className="text-green-400 font-mono text-sm md:text-sm tracking-widest">
                    {isLoading ? '...' : latestReading ? latestReading.current.toFixed(2) : '0.00'}
                </p>
            </div>
          </div>
          <Button onClick={simulateNewReading} className="mt-8" disabled={isLoading || !user}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube2 className="mr-2 h-4 w-4" />}
            {isLoading ? 'Connecting...' : 'Simulate Reading'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
