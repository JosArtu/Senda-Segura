import type {
  EmergencyCategory,
  MapPoint,
  PermissionName,
  Trail,
  TrailEvent,
  TrailEventCategory,
  TrailEventSource,
} from '@/types/domain';

// All values are illustrative fixtures from the concept, not field observations.
export const demoLocation = { label: '20.6512° N, 103.5436° O', accuracy: '±8 m' };

export const emergencyCategories: {
  id: EmergencyCategory;
  title: string;
  description: string;
  icon: 'heart' | 'compass' | 'help';
}[] = [
  {
    id: 'injury',
    title: 'Lesión o malestar',
    description: 'Caída, golpe o una molestia física.',
    icon: 'heart',
  },
  {
    id: 'lost',
    title: 'Persona extraviada',
    description: 'Perdí el sendero o a alguien del grupo.',
    icon: 'compass',
  },
  {
    id: 'other',
    title: 'Otra emergencia',
    description: 'Una situación de riesgo diferente.',
    icon: 'help',
  },
];

export const permissionOptions: {
  id: PermissionName;
  title: string;
  description: string;
  icon: 'pin' | 'bluetooth' | 'phone';
}[] = [
  {
    id: 'location',
    title: 'Ubicación GPS',
    description: 'Compartir tu posición en una emergencia.',
    icon: 'pin',
  },
  {
    id: 'bluetooth',
    title: 'Bluetooth',
    description: 'Conectar con una baliza cercana.',
    icon: 'bluetooth',
  },
  {
    id: 'sms',
    title: 'Mensajes SMS',
    description: 'Usar la señal celular como respaldo.',
    icon: 'phone',
  },
];

export const trails: Trail[] = [
  {
    id: 'rio-caliente',
    name: 'Sendero Río Caliente',
    distance: '4.2 km',
    duration: '1 h 30 min',
    difficulty: 'Fácil',
    risk: 'low',
    description:
      'Consulta la distancia, el tiempo estimado y la dificultad del recorrido junto al río.',
  },
  {
    id: 'los-camachos',
    name: 'Ruta Los Camachos',
    distance: '12 km',
    duration: '2 h 30 min',
    difficulty: 'Moderada',
    risk: 'medium',
    description:
      'Revisa la distancia y el nivel de dificultad antes de comenzar tu recorrido en bicicleta.',
  },
  {
    id: 'el-culebreado',
    name: 'Cerro El Culebreado',
    distance: '7.8 km',
    duration: '4 h',
    difficulty: 'Difícil',
    risk: 'high',
    description: 'Planea tu tiempo y equipo para un recorrido de mayor exigencia.',
  },
];

export const safetyTips = [
  'Descarga el mapa antes de salir.',
  'Comparte tu ruta y tu hora de regreso.',
  'Lleva agua, batería extra y un silbato.',
  'Respeta los senderos y la señalización.',
];

export function isEmergencyCategory(value: unknown): value is EmergencyCategory {
  return emergencyCategories.some((category) => category.id === value);
}

export const trailEventLimits = { title: 60, description: 280 };

export const trailEventCategories: {
  id: TrailEventCategory;
  title: string;
  description: string;
  icon: 'close' | 'mountain' | 'tree' | 'shield' | 'help' | 'pin';
}[] = [
  {
    id: 'blocked',
    title: 'Sendero bloqueado',
    description: 'Un obstáculo impide continuar por el camino.',
    icon: 'close',
  },
  {
    id: 'washout',
    title: 'Sendero deslavado',
    description: 'El piso se deslavó o quedó inestable.',
    icon: 'mountain',
  },
  {
    id: 'fallen-tree',
    title: 'Árbol caído',
    description: 'Un árbol o una rama grande obstruye el paso.',
    icon: 'tree',
  },
  {
    id: 'closure',
    title: 'Cierre temporal',
    description: 'Un tramo está cerrado por ahora.',
    icon: 'shield',
  },
  {
    id: 'damaged-sign',
    title: 'Señalización dañada',
    description: 'Falta una señal o está caída.',
    icon: 'help',
  },
  {
    id: 'other',
    title: 'Otro',
    description: 'Otra condición del recorrido.',
    icon: 'pin',
  },
];

export const currentMapPoint: MapPoint = { x: 170, y: 155, label: 'Tu ubicación' };

const mapReferencePoints: MapPoint[] = [
  currentMapPoint,
  { x: 100, y: 215, label: 'Cerca de CP-01' },
  { x: 245, y: 115, label: 'Cerca de CP-02' },
  { x: 140, y: 85, label: 'Cerca de CP-03' },
];

export function isTrailEventCategory(value: unknown): value is TrailEventCategory {
  return trailEventCategories.some((category) => category.id === value);
}

export function trailEventTitle(event: Pick<TrailEvent, 'category' | 'customTitle'>): string {
  if (event.category === 'other') return event.customTitle?.trim() || 'Otro';
  return trailEventCategories.find((item) => item.id === event.category)?.title ?? 'Evento';
}

export function trailEventCause(event: Pick<TrailEvent, 'category' | 'description'>): string {
  const text = event.description.trim();
  if (text) return text;
  return (
    trailEventCategories.find((item) => item.id === event.category)?.description ??
    'Aviso en el recorrido'
  );
}

export function trailEventSourceLabel(source: TrailEventSource): string {
  if (source === 'rescatista') return 'Equipo de rescate';
  if (source === 'local') return 'En este dispositivo';
  return 'Visitante';
}

export function labelForMapPoint(x: number, y: number): string {
  const nearest = mapReferencePoints.reduce<{ label: string; distance: number }>(
    (best, point) => {
      const distance = Math.hypot(point.x - x, point.y - y);
      return distance < best.distance ? { label: point.label, distance } : best;
    },
    { label: 'Punto en el mapa', distance: Number.POSITIVE_INFINITY },
  );
  return nearest.distance <= 28 ? nearest.label : 'Punto en el mapa';
}

export function visibleTrailEvents(localEvents: TrailEvent[]): TrailEvent[] {
  return [...localEvents].reverse();
}
