
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { leadsApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';

// Define lead status types and their color mappings
const leadStatusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-green-100 text-green-800",
  closed: "bg-purple-100 text-purple-800",
  lost: "bg-gray-100 text-gray-800"
};

interface LeadsListProps {
  className?: string;
}

export function LeadsList({ className }: LeadsListProps) {
  const navigate = useNavigate();
  
  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getLeads
  });
  
  // Get most recent leads
  const recentLeads = leads
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4) || [];
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Leads</CardTitle>
        <Button size="sm" variant="outline" onClick={() => navigate('/leads')}>
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading recent leads...</div>
        ) : recentLeads.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No leads available</div>
        ) : (
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{lead.name?.charAt(0)}</AvatarFallback>
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${lead.id}`} />
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{lead.name}</h3>
                      <p className="text-sm text-muted-foreground">{lead.address}</p>
                    </div>
                  </div>
                  <Badge className={cn("rounded-full font-normal", leadStatusColors[lead.status?.toLowerCase()] || 'bg-gray-100 text-gray-800')}>
                    {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1) || 'New'}
                  </Badge>
                </div>
                
                <div className="mt-3 flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{lead.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{lead.email || 'No email'}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Source: {lead.source || 'Not specified'}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/leads/${lead.id}`)}>
                      Contact
                    </Button>
                    <Button size="sm" variant="default" onClick={() => navigate(`/leads/${lead.id}/quote`)}>
                      Create Quote
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LeadsList;
