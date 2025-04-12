
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';
import CrewsTabContent from '@/components/crews/CrewsTabContent';
import MembersTabContent from '@/components/crews/MembersTabContent';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CrewForm from '@/components/crews/CrewForm';
import CrewMemberForm from '@/components/crews/CrewMemberForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { crewsApi } from '@/services/api';

export default function Crews() {
  const [activeTab, setActiveTab] = useState('crews');
  const [isCrewDialogOpen, setIsCrewDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  // Fetch crews
  const { data: crews, isLoading: crewsLoading } = useQuery({
    queryKey: ['crews'],
    queryFn: crewsApi.getCrews,
  });
  
  // Get crew members from all crews
  const { data: allCrewMembers, isLoading: membersLoading } = useQuery({
    queryKey: ['crew-members'],
    queryFn: async () => {
      const crewsWithMembers = await Promise.all(
        (crews || []).map(crew => crewsApi.getCrewWithMembers(crew.id))
      );
      
      // Extract and flatten all crew members
      return crewsWithMembers.flatMap(crew => 
        crew.crew_members.map((member: any) => ({
          ...member, 
          crew: crew.name
        }))
      );
    },
    enabled: !!crews && crews.length > 0
  });
  
  const handleCrewSubmit = () => {
    queryClient.invalidateQueries({ queryKey: ['crews'] });
    setIsCrewDialogOpen(false);
  };
  
  const handleMemberSubmit = () => {
    queryClient.invalidateQueries({ queryKey: ['crews'] });
    queryClient.invalidateQueries({ queryKey: ['crew-members'] });
    setIsMemberDialogOpen(false);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Crews & Personnel</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsCrewDialogOpen(true)}
            >
              <Users className="mr-2 h-4 w-4" />
              New Crew
            </Button>
            <Button
              onClick={() => {
                if (crews && crews.length > 0) {
                  setSelectedCrew(crews[0].id);
                  setIsMemberDialogOpen(true);
                } else {
                  // Show notification that they need to create a crew first
                  import('sonner').then(({ toast }) => {
                    toast.error('Please create a crew first before adding members.');
                  });
                }
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="crews" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="crews">
              <Users className="h-4 w-4 mr-2" />
              Crews
            </TabsTrigger>
            <TabsTrigger value="members">
              <UserPlus className="h-4 w-4 mr-2" />
              Individual Members
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="crews" className="mt-6">
            <CrewsTabContent 
              crews={crews || []}
              isLoading={crewsLoading}
              onEditCrew={(crewId) => {
                setSelectedCrew(crewId);
                setIsCrewDialogOpen(true);
              }}
              onAddMember={(crewId) => {
                setSelectedCrew(crewId);
                setIsMemberDialogOpen(true);
              }}
              onRefresh={() => {
                queryClient.invalidateQueries({ queryKey: ['crews'] });
              }}
            />
          </TabsContent>
          
          <TabsContent value="members" className="mt-6">
            <MembersTabContent 
              members={allCrewMembers || []}
              isLoading={membersLoading}
              onEditMember={(memberId, crewId) => {
                setSelectedCrew(crewId);
                // You would need to implement this further
                // by finding the member and opening a dialog to edit
              }}
              onRefresh={() => {
                queryClient.invalidateQueries({ queryKey: ['crew-members'] });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Crew Dialog */}
      <Dialog open={isCrewDialogOpen} onOpenChange={setIsCrewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{selectedCrew ? 'Edit Crew' : 'Create New Crew'}</DialogTitle>
          </DialogHeader>
          <CrewForm 
            onSubmit={handleCrewSubmit} 
            initialData={selectedCrew && crews ? crews.find(c => c.id === selectedCrew) : undefined}
            onCancel={() => setIsCrewDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Crew Member Dialog */}
      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Crew Member</DialogTitle>
          </DialogHeader>
          {selectedCrew && (
            <CrewMemberForm 
              crewId={selectedCrew}
              onSubmit={handleMemberSubmit}
              onCancel={() => setIsMemberDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
