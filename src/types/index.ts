export type Reading = {
  id: number;
  timestamp: string;
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
