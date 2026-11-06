import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui';
import { colors, shared } from '@/constants/theme';
import { emergencyCategories } from '@/data/demo';
import { routes } from '@/navigation/routes';
import type { EmergencyCategory } from '@/types/domain';

export default function EmergencyScreen() {
  const [category, setCategory] = useState<EmergencyCategory | null>(null);
  return (
    <Screen
      title="¿Qué está pasando?"
      eyebrow="PEDIR AYUDA · PASO 1 DE 2"
      back
      footer={
        <>
          <Button
            label="Continuar"
            disabled={!category}
            onPress={() =>
              category && router.push({ pathname: routes.confirm, params: { category } })
            }
            icon="arrow"
          />
          <Button
            label="Cancelar y volver al mapa"
            variant="secondary"
            onPress={() => router.dismissTo(routes.map)}
          />
        </>
      }
    >
      <Text style={shared.body}>Selecciona la situación que mejor describe tu emergencia.</Text>
      {emergencyCategories.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="radio"
          accessibilityLabel={item.title}
          accessibilityState={{ checked: item.id === category }}
          onPress={() => setCategory(item.id)}
          style={[
            shared.card,
            shared.row,
            {
              minHeight: 110,
              borderColor: item.id === category ? colors.green : colors.border,
              backgroundColor: item.id === category ? colors.sage : colors.white,
            },
          ]}
        >
          <Icon name={item.icon} size={30} />
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={shared.label}>{item.title}</Text>
            <Text style={[shared.body, { fontSize: 13 }]}>{item.description}</Text>
          </View>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 1.5,
              borderColor: colors.green,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {item.id === category && (
              <View
                style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.green }}
              />
            )}
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}
