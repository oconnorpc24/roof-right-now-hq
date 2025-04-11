
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define lead status types and their color mappings
const leadStatusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-green-100 text-green-800",
  closed: "bg-purple-100 text-purple-800",
  lost: "bg-gray-100 text-gray-800"
};

type LeadStatus = keyof typeof leadStatusColors;

// Lead type definition
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: LeadStatus;
  date: string;
  source: string;
}

// For demo data
const demoLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, USA',
    status: 'new',
    date: '2025-04-10',
    source: 'Website'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 234-5678',
    address: '456 Oak Ave, Somewhere, USA',
    status: 'contacted',
    date: '2025-04-09', 
    source: 'Referral'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    phone: '(555) 345-6789',
    address: '789 Pine Rd, Nowhere, USA',
    status: 'qualified',
    date: '2025-04-08',
    source: 'Google Ads'
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma.d@example.com',
    phone: '(555) 456-7890',
    address: '321 Elm St, Elsewhere, USA',
    status: 'new',
    date: '2025-04-07',
    source: 'Facebook'
  }
];

interface LeadsListProps {
  className?: string;
}

export function LeadsList({ className }: LeadsListProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Leads</CardTitle>
        <Button size="sm" variant="outline">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {demoLeads.map((lead) => (
            <div key={lead.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${lead.id}`} />
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{lead.name}</h3>
                    <p className="text-sm text-muted-foreground">{lead.address}</p>
                  </div>
                </div>
                <Badge className={cn("rounded-full font-normal", leadStatusColors[lead.status])}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
              </div>
              
              <div className="mt-3 flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{lead.email}</span>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Source: {lead.source}</span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Contact</Button>
                  <Button size="sm" variant="default">Create Quote</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default LeadsList;
