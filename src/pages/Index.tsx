
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import LeadsList from '@/components/dashboard/LeadsList';
import UpcomingJobs from '@/components/dashboard/UpcomingJobs';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import CrewAvailability from '@/components/dashboard/CrewAvailability';
import { UserPlus, FileText, CircleDollarSign, Calendar } from 'lucide-react';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="New Leads" 
            value="24" 
            description="Last 7 days" 
            icon={UserPlus}
            trend="up"
            trendValue="↑ 12% from last week"
          />
          <StatCard 
            title="Pending Quotes" 
            value="18" 
            description="Need attention" 
            icon={FileText}
            trend="neutral"
            trendValue="Same as last week"
          />
          <StatCard 
            title="Revenue (MTD)" 
            value="$45,850" 
            description="April 2025" 
            icon={CircleDollarSign}
            trend="up"
            trendValue="↑ 8% from last month"
          />
          <StatCard 
            title="Scheduled Jobs" 
            value="12" 
            description="Next 14 days" 
            icon={Calendar}
            trend="down"
            trendValue="↓ 2 from last week"
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
