import type { EmergencyCategory, PermissionName, Trail } from '@/types/domain';

// All values are illustrative fixtures from the concept, not field observations.
export const demoLocation = { label: '20.6512° N, 103.5436° O', accuracy: '±8 m' };
export const demoMapPackage = { version: '1.0', size: '148 MB' };

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
      'Un recorrido de ejemplo junto al río, pensado para explorar la vista de rutas del prototipo.',
  },
  {
    id: 'los-camachos',
    name: 'Ruta Los Camachos',
    distance: '12 km',
    duration: '2 h 30 min',
    difficulty: 'Moderada',
    risk: 'medium',
    description:
      'Una ruta ciclista de ejemplo con cambios de pendiente. La información final se validará con guardabosques.',
  },
  {
    id: 'el-culebreado',
    name: 'Cerro El Culebreado',
    distance: '7.8 km',
    duration: '4 h',
    difficulty: 'Difícil',
    risk: 'high',
    description:
      'Un recorrido de ejemplo para representar una ruta de mayor exigencia y su información de seguridad.',
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
