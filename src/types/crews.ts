
export interface CrewMember {
  id: string;
  name: string;
  role: string;
  crew: string;
  crew_id: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  created_at?: string;
}

export interface Crew {
  id: string;
  name: string;
  members?: CrewMember[];
  specialties?: string[];
  status: string;
  current_job?: string;
  notes?: string;
  created_at?: string;
}
