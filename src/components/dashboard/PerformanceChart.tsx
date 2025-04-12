
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { leadsApi, quotesApi, jobsApi } from '@/services/api';
import { format } from 'date-fns';

type TimeRange = 'monthly' | 'quarterly';

interface PerformanceChartProps {
  className?: string;
}

export function PerformanceChart({ className }: PerformanceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [monthlyData, setMonthlyData] = useState([]);
  const [quarterlyData, setQuarterlyData] = useState([]);
  
  // Fetch data
  const { data: leadsData } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getLeads
  });
  
  const { data: quotesData } = useQuery({
    queryKey: ['quotes'],
    queryFn: quotesApi.getQuotes
  });
  
  const { data: jobsData } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getJobs
  });
  
  useEffect(() => {
    if (leadsData && quotesData && jobsData) {
      // Process monthly data
      const months = Array(12).fill(0).map((_, i) => ({
        name: format(new Date(2025, i, 1), 'MMM'),
        leads: 0,
        quotes: 0,
        jobs: 0
      }));
      
      // Count leads by month
      leadsData.forEach(lead => {
        const date = new Date(lead.created_at);
        const month = date.getMonth();
        months[month].leads++;
      });
      
      // Count quotes by month
      quotesData.forEach(quote => {
        const date = new Date(quote.created_at);
        const month = date.getMonth();
        months[month].quotes++;
      });
      
      // Count jobs by month
      jobsData.forEach(job => {
        const date = new Date(job.created_at);
        const month = date.getMonth();
        months[month].jobs++;
      });
      
      setMonthlyData(months);
      
      // Process quarterly data
      const quarters = [
        { name: 'Q1', leads: 0, quotes: 0, jobs: 0 },
        { name: 'Q2', leads: 0, quotes: 0, jobs: 0 },
        { name: 'Q3', leads: 0, quotes: 0, jobs: 0 },
        { name: 'Q4', leads: 0, quotes: 0, jobs: 0 }
      ];
      
      months.forEach((month, index) => {
        const quarter = Math.floor(index / 3);
        quarters[quarter].leads += month.leads;
        quarters[quarter].quotes += month.quotes;
        quarters[quarter].jobs += month.jobs;
      });
      
      setQuarterlyData(quarters);
    }
  }, [leadsData, quotesData, jobsData]);
  
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
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">Loading performance data...</div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}

export default PerformanceChart;
