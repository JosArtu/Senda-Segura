export type EmergencyCategory = 'injury' | 'lost' | 'other';
export type DemoOutcome = 'confirmed' | 'pending';
export type PermissionName = 'location' | 'bluetooth' | 'sms';

export interface EmergencyProfile {
  name: string;
  phone: string;
}

export interface DemoAlert {
  id: string;
  category: EmergencyCategory;
  outcome: DemoOutcome;
  createdAt: string;
  profile: EmergencyProfile;
}

export interface Trail {
  id: string;
  name: string;
  distance: string;
  duration: string;
  difficulty: string;
  risk: 'low' | 'medium' | 'high';
  description: string;
}
