import { Tabs } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { colors } from '@/constants/theme';

const tabs: { name: string; title: string; icon: IconName }[] = [
  { name: 'map', title: 'Mapa', icon: 'map' },
  { name: 'trails', title: 'Rutas', icon: 'compass' },
  { name: 'offline', title: 'Sin conexión', icon: 'download' },
  { name: 'profile', title: 'Perfil', icon: 'user' },
];

export function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: 68 + insets.bottom,
          paddingTop: 8,
          paddingBottom: 8 + insets.bottom,
        },
        tabBarLabelStyle: { fontSize: 10, lineHeight: 16, fontWeight: '600' },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <Icon
                name={tab.icon}
                color={typeof color === 'string' ? color : colors.green}
                size={size}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
