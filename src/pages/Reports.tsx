
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi, leadsApi, quotesApi } from '@/services/api';
import { format } from 'date-fns';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Reports() {
  const [timeRange, setTimeRange] = useState('year');
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [weeklyJobs, setWeeklyJobs] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [jobsCompleted, setJobsCompleted] = useState(0);
  const [avgJobValue, setAvgJobValue] = useState(0);
  
  // Fetch jobs data
  const { data: jobsData, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getJobs
  });
  
  // Fetch quotes data
  const { data: quotesData, isLoading: isLoadingQuotes } = useQuery({
    queryKey: ['quotes'],
    queryFn: quotesApi.getQuotes
  });
  
  // Fetch leads data
  const { data: leadsData, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getLeads
  });
  
  useEffect(() => {
    if (quotesData) {
      // Calculate monthly revenue
      const revenueByMonth = Array(12).fill(0).map((_, index) => ({
        name: format(new Date(2025, index, 1), 'MMM'),
        revenue: 0
      }));
      
      quotesData.forEach(quote => {
        if (quote.status === 'accepted') {
          const date = new Date(quote.created_at);
          const month = date.getMonth();
          revenueByMonth[month].revenue += Number(quote.amount || 0);
        }
      });
      
      setMonthlyRevenue(revenueByMonth);
      
      // Calculate total revenue
      const total = quotesData
        .filter(quote => quote.status === 'accepted')
        .reduce((sum, quote) => sum + Number(quote.amount || 0), 0);
      setTotalRevenue(total);
    }
  }, [quotesData]);
  
  useEffect(() => {
    if (jobsData) {
      // Count jobs by type
      const types = {};
      jobsData.forEach(job => {
        const type = job.title?.split(' ')[0] || 'Other';
        types[type] = (types[type] || 0) + 1;
      });
      
      const jobTypeData = Object.keys(types).map(key => ({
        name: key,
        value: types[key]
      }));
      
      setJobTypes(jobTypeData);
      
      // Calculate completed jobs
      const completed = jobsData.filter(job => job.status === 'completed').length;
      setJobsCompleted(completed);
      
      // Calculate average job value
      if (quotesData && completed > 0) {
        const completedJobsValue = jobsData
          .filter(job => job.status === 'completed')
          .map(job => {
            const quote = quotesData.find(q => q.id === job.quote_id);
            return quote ? Number(quote.amount || 0) : 0;
          })
          .reduce((sum, val) => sum + val, 0);
          
        setAvgJobValue(completedJobsValue / completed);
      }
      
      // Weekly jobs data
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weeklyJobsData = days.map(day => ({
        day,
        completed: 0,
        scheduled: 0
      }));
      
      jobsData.forEach(job => {
        if (job.scheduled_date) {
          const date = new Date(job.scheduled_date);
          const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert Sunday=0 to Sunday=6
          
          if (job.status === 'completed') {
            weeklyJobsData[dayIndex].completed += 1;
          }
          
          weeklyJobsData[dayIndex].scheduled += 1;
        }
      });
      
      setWeeklyJobs(weeklyJobsData);
    }
  }, [jobsData, quotesData]);
  
  useEffect(() => {
    if (leadsData) {
      // Count leads by source
      const sources = {};
      leadsData.forEach(lead => {
        const source = lead.source || 'Unknown';
        sources[source] = (sources[source] || 0) + 1;
      });
      
      const leadSourceData = Object.keys(sources).map(key => ({
        name: key,
        value: sources[key]
      }));
      
      setLeadSources(leadSourceData);
    }
  }, [leadsData]);
  
  const isLoading = isLoadingJobs || isLoadingQuotes || isLoadingLeads;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <div className="flex space-x-2">
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>Year to date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${isLoading ? '0' : totalRevenue.toLocaleString()}</div>
              {!isLoading && (
                <div className="text-sm text-muted-foreground">Based on accepted quotes</div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Jobs Completed</CardTitle>
              <CardDescription>Year to date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? '0' : jobsCompleted}</div>
              {!isLoading && (
                <div className="text-sm text-muted-foreground">Out of {jobsData?.length || 0} total jobs</div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Average Job Value</CardTitle>
              <CardDescription>Year to date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${isLoading ? '0' : avgJobValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              {!isLoading && (
                <div className="text-sm text-muted-foreground">Based on completed jobs</div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3">
            <TabsTrigger value="revenue" className="flex items-center">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-2" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Leads
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue trend over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">Loading revenue data...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyRevenue}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Types</CardTitle>
                  <CardDescription>Breakdown of jobs by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {isLoading || jobTypes.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        {isLoading ? 'Loading job data...' : 'No job data available'}
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={jobTypes}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {jobTypes.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} jobs`, 'Count']} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                  <CardDescription>Jobs scheduled vs completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {isLoading || weeklyJobs.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        {isLoading ? 'Loading weekly data...' : 'No weekly data available'}
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={weeklyJobs}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="scheduled" fill="#8884d8" name="Scheduled" />
                          <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="leads" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Where new leads are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  {isLoading || leadSources.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      {isLoading ? 'Loading lead data...' : 'No lead source data available'}
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leadSources}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {leadSources.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} leads`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
