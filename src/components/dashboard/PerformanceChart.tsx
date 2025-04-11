
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Demo data
const monthlyData = [
  { name: 'Jan', leads: 40, quotes: 24, jobs: 18 },
  { name: 'Feb', leads: 45, quotes: 28, jobs: 22 },
  { name: 'Mar', leads: 55, quotes: 32, jobs: 25 },
  { name: 'Apr', leads: 65, quotes: 40, jobs: 30 },
  { name: 'May', leads: 85, quotes: 55, jobs: 42 },
  { name: 'Jun', leads: 95, quotes: 62, jobs: 48 },
  { name: 'Jul', leads: 90, quotes: 58, jobs: 45 },
  { name: 'Aug', leads: 100, quotes: 65, jobs: 50 },
  { name: 'Sep', leads: 85, quotes: 52, jobs: 40 },
  { name: 'Oct', leads: 75, quotes: 48, jobs: 35 },
  { name: 'Nov', leads: 65, quotes: 40, jobs: 28 },
  { name: 'Dec', leads: 50, quotes: 30, jobs: 22 },
];

const quarterlyData = [
  { name: 'Q1', leads: 140, quotes: 84, jobs: 65 },
  { name: 'Q2', leads: 245, quotes: 157, jobs: 120 },
  { name: 'Q3', leads: 275, quotes: 175, jobs: 135 },
  { name: 'Q4', leads: 190, quotes: 118, jobs: 85 },
];

type TimeRange = 'monthly' | 'quarterly';

interface PerformanceChartProps {
  className?: string;
}

export function PerformanceChart({ className }: PerformanceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  
  const chartData = timeRange === 'monthly' ? monthlyData : quarterlyData;
  
  return (
    <Card className={cn("col-span-2", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Overview</CardTitle>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant={timeRange === 'monthly' ? "default" : "outline"}
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </Button>
          <Button 
            size="sm" 
            variant={timeRange === 'quarterly' ? "default" : "outline"}
            onClick={() => setTimeRange('quarterly')}
          >
            Quarterly
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="leads" name="Leads" fill="#1A365D" />
            <Bar dataKey="quotes" name="Quotes" fill="#C05621" />
            <Bar dataKey="jobs" name="Jobs" fill="#ED8936" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default PerformanceChart;
