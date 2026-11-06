import { createContext, useContext, useState, type PropsWithChildren } from 'react';

import type {
  DemoAlert,
  EmergencyCategory,
  EmergencyProfile,
  PermissionName,
} from '@/types/domain';

function useSessionState() {
  const [profile, setProfile] = useState<EmergencyProfile>({ name: '', phone: '' });
  const [hasStarted, setHasStarted] = useState(false);
  const [permissions, setPermissions] = useState<Record<PermissionName, boolean>>({
    location: true,
    bluetooth: true,
    sms: false,
  });
  const [mapDownloaded, setMapDownloaded] = useState(false);
  const [alerts, setAlerts] = useState<DemoAlert[]>([]);

  const togglePermission = (name: PermissionName) => {
    setPermissions((previous) => ({ ...previous, [name]: !previous[name] }));
  };

  // No transport is connected. Creating a request must never imply delivery.
  const createAlert = (category: EmergencyCategory) => {
    const alert: DemoAlert = {
      id: `SS-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      category,
      outcome: 'pending',
      createdAt: new Date().toISOString(),
      profile: { ...profile },
    };
    setAlerts((previous) => [...previous, alert]);
    return alert.id;
  };

  return {
    profile,
    setProfile,
    hasStarted,
    setHasStarted,
    permissions,
    togglePermission,
    mapDownloaded,
    setMapDownloaded,
    alerts,
    createAlert,
  };
}

const DemoSessionContext = createContext<ReturnType<typeof useSessionState> | null>(null);

// Intentionally memory-only: a full reload resets every simulated value.
export function DemoSessionProvider({ children }: PropsWithChildren) {
  const session = useSessionState();
  return <DemoSessionContext.Provider value={session}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession() {
  const context = useContext(DemoSessionContext);
  if (!context) throw new Error('useDemoSession must be used within DemoSessionProvider');
  return context;
}
