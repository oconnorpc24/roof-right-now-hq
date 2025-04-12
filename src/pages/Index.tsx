
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import LeadsList from '@/components/dashboard/LeadsList';
import UpcomingJobs from '@/components/dashboard/UpcomingJobs';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import CrewAvailability from '@/components/dashboard/CrewAvailability';
import FollowUpTracker from '@/components/dashboard/FollowUpTracker';
import { UserPlus, FileText, CircleDollarSign, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { leadsApi, quotesApi, jobsApi } from '@/services/api';

const Index = () => {
  const [stats, setStats] = useState({
    newLeads: 0,
    pendingQuotes: 0,
    revenue: 0,
    scheduledJobs: 0
  });
  
  // Fetch data for dashboard
  const { data: leads } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getLeads
  });
  
  const { data: quotes } = useQuery({
    queryKey: ['quotes'],
    queryFn: quotesApi.getQuotes
  });
  
  const { data: jobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getJobs
  });
  
  useEffect(() => {
    // Calculate stats from data
    if (leads && quotes && jobs) {
      // New leads in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentLeads = leads.filter(lead => 
        new Date(lead.created_at) >= sevenDaysAgo
      ).length;
      
      // Pending quotes
      const pendingQuotes = quotes.filter(quote => 
        quote.status?.toLowerCase() === 'pending'
      ).length;
      
      // Monthly revenue (from accepted quotes)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const monthlyRevenue = quotes
        .filter(quote => 
          quote.status?.toLowerCase() === 'accepted' && 
          new Date(quote.created_at) >= startOfMonth
        )
        .reduce((sum, quote) => sum + Number(quote.amount || 0), 0);
      
      // Upcoming scheduled jobs (next 14 days)
      const today = new Date();
      const twoWeeksLater = new Date();
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
      
      const upcomingJobs = jobs.filter(job => {
        if (!job.scheduled_date) return false;
        const jobDate = new Date(job.scheduled_date);
        return jobDate >= today && jobDate <= twoWeeksLater;
      }).length;
      
      setStats({
        newLeads: recentLeads,
        pendingQuotes: pendingQuotes,
        revenue: monthlyRevenue,
        scheduledJobs: upcomingJobs
      });
    }
  }, [leads, quotes, jobs]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="New Leads" 
            value={stats.newLeads.toString()} 
            description="Last 7 days" 
            icon={UserPlus}
            trend="neutral"
            trendValue="Based on recent activity"
          />
          <StatCard 
            title="Pending Quotes" 
            value={stats.pendingQuotes.toString()} 
            description="Need attention" 
            icon={FileText}
            trend="neutral"
            trendValue="Waiting for response"
          />
          <StatCard 
            title="Revenue (MTD)" 
            value={`$${stats.revenue.toLocaleString()}`} 
            description={new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} 
            icon={CircleDollarSign}
            trend="neutral"
            trendValue="From accepted quotes"
          />
          <StatCard 
            title="Scheduled Jobs" 
            value={stats.scheduledJobs.toString()} 
            description="Next 14 days" 
            icon={Calendar}
            trend="neutral"
            trendValue="On the calendar"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PerformanceChart className="lg:col-span-2" />
          <LeadsList className="lg:col-span-1" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingJobs />
          <CrewAvailability />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
