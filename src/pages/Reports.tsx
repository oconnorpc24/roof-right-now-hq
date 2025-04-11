
import { useState } from 'react';
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

// Demo data for reports
const monthlyRevenue = [
  { name: 'Jan', revenue: 32500 },
  { name: 'Feb', revenue: 28700 },
  { name: 'Mar', revenue: 35800 },
  { name: 'Apr', revenue: 42300 },
  { name: 'May', revenue: 47900 },
  { name: 'Jun', revenue: 55200 },
  { name: 'Jul', revenue: 58700 },
  { name: 'Aug', revenue: 61400 },
  { name: 'Sep', revenue: 54900 },
  { name: 'Oct', revenue: 49300 },
  { name: 'Nov', revenue: 45800 },
  { name: 'Dec', revenue: 51200 }
];

const jobTypes = [
  { name: 'Roof Replacement', value: 45 },
  { name: 'Roof Repair', value: 30 },
  { name: 'Gutter Installation', value: 15 },
  { name: 'Inspection', value: 10 }
];

const leadSources = [
  { name: 'Website', value: 40 },
  { name: 'Referral', value: 25 },
  { name: 'Google', value: 20 },
  { name: 'Facebook', value: 10 },
  { name: 'Other', value: 5 }
];

const weeklyJobs = [
  { day: 'Mon', completed: 3, scheduled: 4 },
  { day: 'Tue', completed: 5, scheduled: 6 },
  { day: 'Wed', completed: 4, scheduled: 4 },
  { day: 'Thu', completed: 6, scheduled: 7 },
  { day: 'Fri', completed: 5, scheduled: 5 },
  { day: 'Sat', completed: 2, scheduled: 2 },
  { day: 'Sun', completed: 0, scheduled: 0 }
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Reports() {
  const [timeRange, setTimeRange] = useState('year');
  
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
              <div className="text-3xl font-bold">$532,700</div>
              <div className="text-sm text-green-600">↑ 18% from last year</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Jobs Completed</CardTitle>
              <CardDescription>Year to date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">237</div>
              <div className="text-sm text-green-600">↑ 12% from last year</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Average Job Value</CardTitle>
              <CardDescription>Year to date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$2,248</div>
              <div className="text-sm text-green-600">↑ 5% from last year</div>
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
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
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
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
