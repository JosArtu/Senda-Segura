export type EmergencyCategory = 'injury' | 'lost' | 'other';
export type PermissionName = 'location' | 'bluetooth' | 'sms';

export interface EmergencyProfile {
  name: string;
  phone: string;
}

export interface DemoAlert {
  id: string;
  category: EmergencyCategory;
  outcome: 'pending';
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

export type TrailEventCategory =
  'blocked' | 'washout' | 'fallen-tree' | 'closure' | 'damaged-sign' | 'other';

export type TrailEventSource = 'visitante' | 'rescatista' | 'local';

export interface MapPoint {
  x: number;
  y: number;
  label: string;
}

export interface TrailEventDraft {
  category: TrailEventCategory;
  customTitle?: string;
  description: string;
}

export interface TrailEvent {
  id: string;
  category: TrailEventCategory;
  customTitle?: string;
  description: string;
  point: MapPoint;
  source: TrailEventSource;
  createdAt: string;
}
