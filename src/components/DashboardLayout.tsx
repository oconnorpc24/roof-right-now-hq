
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 overflow-auto bg-muted">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
