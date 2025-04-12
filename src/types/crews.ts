
export interface CrewMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  crew: string;
  phone: string;
  email: string;
  address: string;
}

export interface Crew {
  id: number;
  name: string;
  members: CrewMember[];
  specialties: string[];
  status: string;
  currentJob: string;
}
