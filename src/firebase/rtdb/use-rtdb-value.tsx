'use client';

import { useState, useEffect } from 'react';
import { DatabaseReference, onValue, off, DataSnapshot } from 'firebase/database';

interface UseRtdbValueResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useRtdbValue<T = any>(
  memoizedDbRef: DatabaseReference | null | undefined
): UseRtdbValueResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!memoizedDbRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const listener = onValue(
      memoizedDbRef,
      (snapshot: DataSnapshot) => {
        setData(snapshot.val() as T);
        setIsLoading(false);
      },
      (err: Error) => {
        console.error(err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => {
      off(memoizedDbRef, 'value', listener);
    };
  }, [memoizedDbRef]);

  return { data, isLoading, error };
}
    