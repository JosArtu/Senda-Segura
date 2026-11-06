import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Button, DetailRow, Notice } from '@/components/ui';
import { colors, shared } from '@/constants/theme';
import { demoLocation, emergencyCategories, isEmergencyCategory } from '@/data/demo';
import { useDemoSession } from '@/hooks/useDemoSession';
import { routes } from '@/navigation/routes';
import type { DemoOutcome } from '@/types/domain';

export default function ConfirmEmergencyScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { profile, permissions, simulateAlert } = useDemoSession();
  const [outcome, setOutcome] = useState<DemoOutcome>('confirmed');
  const submitted = useRef(false);
  if (!isEmergencyCategory(category)) return <Redirect href={routes.emergency} />;
  const selected = emergencyCategories.find((item) => item.id === category)!;
  const send = () => {
    if (submitted.current) return;
    submitted.current = true;
    const id = simulateAlert(category, outcome);
    router.replace({ pathname: routes.result, params: { id } });
  };
  return (
    <Screen
      title="Confirma tu solicitud"
      eyebrow="PEDIR AYUDA · PASO 2 DE 2"
      back
      footer={
        <>
          <Button label="Simular envío de alerta" icon="shield" variant="danger" onPress={send} />
          <Button
            label="Cancelar y volver al mapa"
            variant="secondary"
            onPress={() => router.dismissTo(routes.map)}
          />
        </>
      }
    >
      <View style={[shared.card, { backgroundColor: colors.paleRed, borderColor: '#EAD0D5' }]}>
        <Icon name="shield" color={colors.red} size={30} />
        <Text style={[shared.heading, { color: colors.red }]}>Revisa antes de continuar</Text>
        <Text style={shared.body}>
          La simulación incluirá los siguientes datos. No se enviará ningún mensaje.
        </Text>
      </View>
      <View style={shared.card}>
        <DetailRow label="Emergencia" value={selected.title} />
        <DetailRow
          label="Ubicación de ejemplo"
          value={permissions.location ? demoLocation.label : 'No disponible'}
        />
        <DetailRow label="Perfil" value={profile.name || 'Sin perfil'} />
        <DetailRow label="Teléfono" value={profile.phone || 'Sin teléfono'} />
      </View>
      {!permissions.location && (
        <Notice warning>
          GPS desactivado en esta demostración. El resultado seguirá siendo simulado y no incluirá
          una lectura real.
        </Notice>
      )}
      <View style={shared.stack}>
        <Text accessibilityRole="header" style={shared.heading}>
          Escenario de prueba
        </Text>
        {(
          [
            {
              id: 'confirmed',
              label: 'Con recepción simulada',
              description: 'Ver la pantalla de confirmación.',
            },
            {
              id: 'pending',
              label: 'Sin conexión',
              description: 'Dejar la alerta de prueba pendiente.',
            },
          ] as const
        ).map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="radio"
            accessibilityLabel={item.label}
            accessibilityState={{ checked: outcome === item.id }}
            onPress={() => setOutcome(item.id)}
            style={[
              shared.card,
              shared.row,
              { padding: 16, borderColor: outcome === item.id ? colors.green : colors.border },
            ]}
          >
            <Icon name={item.id === 'confirmed' ? 'check' : 'clock'} />
            <View style={{ flex: 1 }}>
              <Text style={shared.label}>{item.label}</Text>
              <Text style={[shared.body, { fontSize: 12 }]}>{item.description}</Text>
            </View>
            {outcome === item.id && <Icon name="check" size={18} />}
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
