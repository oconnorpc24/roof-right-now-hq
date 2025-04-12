
import { Crew } from '@/types/crews';
import CrewCard from './CrewCard';
import { Skeleton } from '@/components/ui/skeleton';

interface CrewsTabContentProps {
  crews: Crew[];
  isLoading?: boolean;
  onEditCrew?: (crewId: string) => void;
  onAddMember?: (crewId: string) => void;
  onRefresh?: () => void;
}

export default function CrewsTabContent({ crews, isLoading, onEditCrew, onAddMember, onRefresh }: CrewsTabContentProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {crews.map(crew => (
        <CrewCard 
          key={crew.id} 
          crew={crew}
          onEdit={onEditCrew && (() => onEditCrew(crew.id))}
          onAddMember={onAddMember && (() => onAddMember(crew.id))}
        />
      ))}
    </div>
  );
}
