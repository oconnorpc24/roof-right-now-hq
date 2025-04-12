
import { Crew, CrewMember } from '@/types/crews';

// Demo crews
export const demoCrews: Crew[] = [
  {
    id: 1,
    name: 'Team Alpha',
    members: [
      { 
        id: 1, 
        name: 'John Doe', 
        role: 'Foreman', 
        avatar: '',
        crew: 'Team Alpha',
        phone: '(555) 123-4567',
        email: 'john.doe@roofrightco.com',
        address: '123 Worker Lane, Anytown, USA'
      },
      { 
        id: 2, 
        name: 'Mike Smith', 
        role: 'Installer', 
        avatar: '',
        crew: 'Team Alpha',
        phone: '(555) 234-5678',
        email: 'mike.smith@roofrightco.com',
        address: '124 Worker Lane, Anytown, USA'
      },
      { 
        id: 3, 
        name: 'Dave Jones', 
        role: 'Helper', 
        avatar: '',
        crew: 'Team Alpha',
        phone: '(555) 345-6789',
        email: 'dave.jones@roofrightco.com',
        address: '125 Worker Lane, Anytown, USA'
      },
    ],
    specialties: ['Roof Replacement', 'Metal Roofing'],
    status: 'active',
    currentJob: 'Roof Replacement - 123 Main St'
  },
  {
    id: 2,
    name: 'Team Beta',
    members: [
      { 
        id: 4, 
        name: 'Alex Johnson', 
        role: 'Foreman', 
        avatar: '',
        crew: 'Team Beta',
        phone: '(555) 456-7890',
        email: 'alex.johnson@roofrightco.com',
        address: '126 Worker Lane, Anytown, USA'
      },
      { 
        id: 5, 
        name: 'Tom Wilson', 
        role: 'Installer', 
        avatar: '',
        crew: 'Team Beta',
        phone: '(555) 567-8901',
        email: 'tom.wilson@roofrightco.com',
        address: '127 Worker Lane, Anytown, USA'
      },
      { 
        id: 6, 
        name: 'Chris Lee', 
        role: 'Helper', 
        avatar: '',
        crew: 'Team Beta',
        phone: '(555) 678-9012',
        email: 'chris.lee@roofrightco.com',
        address: '128 Worker Lane, Anytown, USA'
      },
    ],
    specialties: ['Roof Repair', 'Shingle Installation'],
    status: 'active',
    currentJob: 'Leak Repair - 456 Oak Ave'
  },
  {
    id: 3,
    name: 'Team Charlie',
    members: [
      { 
        id: 7, 
        name: 'Robert Davis', 
        role: 'Foreman', 
        avatar: '',
        crew: 'Team Charlie',
        phone: '(555) 789-0123',
        email: 'robert.davis@roofrightco.com',
        address: '129 Worker Lane, Anytown, USA'
      },
      { 
        id: 8, 
        name: 'Paul Roberts', 
        role: 'Installer', 
        avatar: '',
        crew: 'Team Charlie',
        phone: '(555) 890-1234',
        email: 'paul.roberts@roofrightco.com',
        address: '130 Worker Lane, Anytown, USA'
      },
    ],
    specialties: ['Skylight Installation', 'Ventilation'],
    status: 'unavailable',
    currentJob: 'On vacation until April 20'
  },
  {
    id: 4,
    name: 'Team Delta',
    members: [
      { 
        id: 9, 
        name: 'Mark Thompson', 
        role: 'Foreman', 
        avatar: '',
        crew: 'Team Delta',
        phone: '(555) 901-2345',
        email: 'mark.thompson@roofrightco.com',
        address: '131 Worker Lane, Anytown, USA'
      },
      { 
        id: 10, 
        name: 'Kevin White', 
        role: 'Installer', 
        avatar: '',
        crew: 'Team Delta',
        phone: '(555) 012-3456',
        email: 'kevin.white@roofrightco.com',
        address: '132 Worker Lane, Anytown, USA'
      },
      { 
        id: 11, 
        name: 'Brian Miller', 
        role: 'Helper', 
        avatar: '',
        crew: 'Team Delta',
        phone: '(555) 123-4567',
        email: 'brian.miller@roofrightco.com',
        address: '133 Worker Lane, Anytown, USA'
      },
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
    phone: member.phone,
    email: member.email,
    address: member.address
  }))
);
