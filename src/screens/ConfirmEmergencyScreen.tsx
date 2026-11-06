import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Button, DetailRow, Notice } from '@/components/ui';
import { colors, shared } from '@/constants/theme';
import { demoLocation, emergencyCategories, isEmergencyCategory } from '@/data/demo';
import { useDemoSession } from '@/hooks/useDemoSession';
import { routes } from '@/navigation/routes';

export default function ConfirmEmergencyScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { profile, permissions, createAlert } = useDemoSession();
  const submitted = useRef(false);
  if (!isEmergencyCategory(category)) return <Redirect href={routes.emergency} />;
  const selected = emergencyCategories.find((item) => item.id === category)!;
  const send = () => {
    if (submitted.current) return;
    submitted.current = true;
    const id = createAlert(category);
    router.replace({ pathname: routes.result, params: { id } });
  };
  return (
    <Screen
      title="Confirma tu solicitud"
      eyebrow="PEDIR AYUDA · PASO 2 DE 2"
      back
      footer={
        <>
          <Button label="Solicitar ayuda" icon="shield" variant="danger" onPress={send} />
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
        <Text style={shared.body}>Comprueba los datos de tu solicitud antes de continuar.</Text>
      </View>
      <View style={shared.card}>
        <DetailRow label="Emergencia" value={selected.title} />
        <DetailRow
          label="Ubicación"
          value={permissions.location ? demoLocation.label : 'No disponible'}
        />
        <DetailRow label="Perfil" value={profile.name || 'Sin perfil'} />
        <DetailRow label="Teléfono" value={profile.phone || 'Sin teléfono'} />
      </View>
      {!permissions.location && (
        <Notice warning>La ubicación está desactivada en tus preferencias.</Notice>
      )}
    </Screen>
  );
}
