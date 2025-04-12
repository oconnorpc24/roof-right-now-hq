
import { Crew } from '@/types/crews';
import CrewCard from './CrewCard';

interface CrewsTabContentProps {
  crews: Crew[];
}

export default function CrewsTabContent({ crews }: CrewsTabContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {crews.map(crew => (
        <CrewCard key={crew.id} crew={crew} />
      ))}
    </div>
  );
}
