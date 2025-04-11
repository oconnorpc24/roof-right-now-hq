
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Home, UserPlus, Calendar, Users, FileText, Settings, Clipboard, BarChart } from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', path: '/', icon: Home },
  { title: 'Leads', path: '/leads', icon: UserPlus },
  { title: 'Quotes', path: '/quotes', icon: Clipboard },
  { title: 'Jobs', path: '/jobs', icon: FileText },
  { title: 'Schedule', path: '/schedule', icon: Calendar },
  { title: 'Crews', path: '/crews', icon: Users },
  { title: 'Reports', path: '/reports', icon: BarChart },
  { title: 'Settings', path: '/settings', icon: Settings },
];

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-roofing-terracotta rounded-md flex items-center justify-center">
            <span className="text-white font-bold">RR</span>
          </div>
          <h1 className="text-white text-xl font-bold">Roof Right</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-slate-300">
          <p>Roof Right Now HQ</p>
          <p>v1.0.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default DashboardSidebar;
