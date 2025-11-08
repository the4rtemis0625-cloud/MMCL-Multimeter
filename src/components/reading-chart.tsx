'use client';

import React from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';
import { type Reading } from '@/types';

interface ReadingChartProps {
  data: Reading[];
  dataKey: 'voltage' | 'current' | 'resistance';
  color: string;
  title: string;
  unit: string;
  icon: LucideIcon;
}

export default function ReadingChart({ data, dataKey, color, title, unit, icon: Icon }: ReadingChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-muted-foreground" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>Readings for {title.toLowerCase()} over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="timestamp" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} domain={['dataMin', 'dataMax']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'hsl(var(--shadow))',
                }}
                labelStyle={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: 'bold',
                }}
                formatter={(value: number) => [`${value} ${unit}`, title]}
              />
              <Line type="monotone" dataKey={dataKey} stroke={`hsl(${color})`} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
