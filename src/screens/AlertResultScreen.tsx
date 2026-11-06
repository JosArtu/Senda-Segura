import { router, useLocalSearchParams } from 'expo-router';
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
  const { alerts, confirmPendingAlert } = useDemoSession();
  const alert = alerts.find((item) => item.id === id);
  if (!alert)
    return (
      <Screen title="Sin alerta de prueba" back>
        <Notice>
          Esta alerta no existe en la sesión. Los datos de prueba se borran al recargar.
        </Notice>
        <Button label="Volver al mapa" onPress={() => router.dismissTo(routes.map)} />
      </Screen>
    );
  const confirmed = alert.outcome === 'confirmed';
  return (
    <Screen
      title={confirmed ? 'Recepción simulada' : 'Alerta de prueba pendiente'}
      eyebrow="RESULTADO DE LA DEMOSTRACIÓN"
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
            backgroundColor: confirmed ? colors.sage : colors.paleAmber,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            name={confirmed ? 'check' : 'clock'}
            size={48}
            color={confirmed ? colors.green : colors.amber}
          />
        </View>
        <Badge tone={confirmed ? 'green' : 'amber'}>
          {confirmed ? 'Confirmada · solo simulación' : 'Pendiente · solo en memoria'}
        </Badge>
        <Text style={[shared.body, { textAlign: 'center' }]}>
          {confirmed
            ? 'Así se vería una confirmación de recepción. Ningún equipo de rescate recibió esta alerta.'
            : 'Este escenario muestra una alerta sin un medio de envío. Permanecerá en esta sesión hasta que simules la recepción o recargues la app.'}
        </Text>
      </View>
      <View style={shared.card}>
        <DetailRow label="Referencia de prueba" value={alert.id} />
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
        <DetailRow label="Perfil de ejemplo" value={alert.profile.name || 'Sin perfil'} />
      </View>
      {!confirmed && (
        <Button
          label="Simular recuperación y recepción"
          icon="check"
          onPress={() => confirmPendingAlert(alert.id)}
        />
      )}
      <Notice>
        Una recepción real deberá confirmarse mediante el sistema de comunicación. Este prototipo no
        tiene conexión con balizas, SMS ni guardabosques.
      </Notice>
    </Screen>
  );
}
