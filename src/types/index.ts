import { type Timestamp } from 'firebase/firestore';

export type Reading = {
  id: string; // Firestore document ID
  timestamp: Timestamp | Date;
  voltage: number;
  current: number;
  resistance: number;
};

export type Anomaly = {
  id: number;
  timestamp: string;
  type: 'Voltage' | 'Current' | 'Resistance';
  value: number;
};
