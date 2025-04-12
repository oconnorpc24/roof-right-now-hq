
import { Crew, CrewMember } from '@/types/crews';

// Demo crews
export const demoCrews: Crew[] = [
  {
    id: 1,
    name: 'Team Alpha',
    members: [
      { id: 1, name: 'John Doe', role: 'Foreman', avatar: '' },
      { id: 2, name: 'Mike Smith', role: 'Installer', avatar: '' },
      { id: 3, name: 'Dave Jones', role: 'Helper', avatar: '' },
    ],
    specialties: ['Roof Replacement', 'Metal Roofing'],
    status: 'active',
    currentJob: 'Roof Replacement - 123 Main St'
  },
  {
    id: 2,
    name: 'Team Beta',
    members: [
      { id: 4, name: 'Alex Johnson', role: 'Foreman', avatar: '' },
      { id: 5, name: 'Tom Wilson', role: 'Installer', avatar: '' },
      { id: 6, name: 'Chris Lee', role: 'Helper', avatar: '' },
    ],
    specialties: ['Roof Repair', 'Shingle Installation'],
    status: 'active',
    currentJob: 'Leak Repair - 456 Oak Ave'
  },
  {
    id: 3,
    name: 'Team Charlie',
    members: [
      { id: 7, name: 'Robert Davis', role: 'Foreman', avatar: '' },
      { id: 8, name: 'Paul Roberts', role: 'Installer', avatar: '' },
    ],
    specialties: ['Skylight Installation', 'Ventilation'],
    status: 'unavailable',
    currentJob: 'On vacation until April 20'
  },
  {
    id: 4,
    name: 'Team Delta',
    members: [
      { id: 9, name: 'Mark Thompson', role: 'Foreman', avatar: '' },
      { id: 10, name: 'Kevin White', role: 'Installer', avatar: '' },
      { id: 11, name: 'Brian Miller', role: 'Helper', avatar: '' },
    ],
    specialties: ['Inspections', 'Maintenance'],
    status: 'active',
    currentJob: 'Roof Inspection - 101 Pine Rd'
  },
];

// Demo crew members (all members in a flat array)
export const demoMembers: CrewMember[] = demoCrews.flatMap(crew => 
  crew.members.map(member => ({
    ...member,
    crew: crew.name,
    phone: '(555) 123-4567',
    email: `${member.name.toLowerCase().replace(' ', '.')}@roofrightco.com`,
    address: '123 Worker Lane, Anytown, USA'
  }))
);
