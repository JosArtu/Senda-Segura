import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Badge, Button, DetailRow, Notice } from '@/components/ui';
import { colors, shared } from '@/constants/theme';
import { emergencyCategories } from '@/data/demo';
import { useDemoSession } from '@/hooks/useDemoSession';
import { routes } from '@/navigation/routes';

export default function AlertResultScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { alerts } = useDemoSession();
  const [message, setMessage] = useState('');
  const alert = alerts.find((item) => item.id === id);
  if (!alert)
    return (
      <Screen title="Solicitud no disponible" back>
        <Notice>No encontramos esta solicitud. Regresa al mapa para continuar.</Notice>
        <Button label="Volver al mapa" onPress={() => router.dismissTo(routes.map)} />
      </Screen>
    );
  return (
    <Screen
      title="Solicitud pendiente"
      eyebrow="ESTADO DE TU SOLICITUD"
      footer={
        <Button label="Volver al mapa" icon="map" onPress={() => router.dismissTo(routes.map)} />
      }
    >
      <View style={{ alignItems: 'center', gap: 18, paddingVertical: 16 }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.paleAmber,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="clock" size={48} color={colors.amber} />
        </View>
        <Badge tone="amber">Pendiente de envío</Badge>
        <Text style={[shared.body, { textAlign: 'center' }]}>
          Tu solicitud está pendiente de envío. Aún no hay confirmación de recepción.
        </Text>
      </View>
      <View style={shared.card}>
        <DetailRow label="Referencia" value={alert.id} />
        <DetailRow
          label="Emergencia"
          value={
            emergencyCategories.find((item) => item.id === alert.category)?.title ??
            'Otra emergencia'
          }
        />
        <DetailRow
          label="Hora"
          value={new Date(alert.createdAt).toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        />
        <DetailRow label="Perfil" value={alert.profile.name || 'Sin perfil'} />
      </View>
      <Button
        label="Reintentar envío"
        icon="arrow"
        onPress={() =>
          setMessage('El servicio de envío no está disponible. Tu solicitud sigue pendiente.')
        }
      />
      {message !== '' && (
        <View accessibilityLiveRegion="polite">
          <Notice warning>{message}</Notice>
        </View>
      )}
    </Screen>
  );
}
