import { type Reading } from '@/types';

// Function to generate a random number within a range and format it
const getRandom = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

// Generate mock data for multimeter readings
export const generateMockReadings = (count: number): Reading[] => {
  const readings: Reading[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i - 1) * 60000); // 1 minute intervals

    // Introduce anomalies occasionally
    const isVoltageAnomaly = Math.random() < 0.1;
    const isCurrentAnomaly = Math.random() < 0.1;
    const isResistanceAnomaly = Math.random() < 0.1;

    readings.push({
      id: i,
      timestamp: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      voltage: isVoltageAnomaly ? getRandom(5.5, 7.0) : getRandom(4.8, 5.2),
      current: isCurrentAnomaly ? getRandom(2.5, 3.5) : getRandom(1.8, 2.2),
      resistance: isResistanceAnomaly ? getRandom(120, 150) : getRandom(95, 105),
    });
  }
  return readings;
};
