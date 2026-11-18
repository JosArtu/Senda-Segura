import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Badge, Button, DetailRow, Notice } from '@/components/ui';
import { colors, shared } from '@/constants/theme';
import { trailEventCause, trailEventSourceLabel, trailEventTitle } from '@/data/demo';
import { useDemoSession } from '@/hooks/useDemoSession';
import { routes } from '@/navigation/routes';

export default function TrailEventDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { trailEvents } = useDemoSession();
  const event = trailEvents.find((item) => item.id === id);
  if (!event)
    return (
      <Screen title="Aviso no disponible" back>
        <Notice>No encontramos este aviso. Regresa al mapa para continuar.</Notice>
        <Button label="Volver al mapa" onPress={() => router.dismissTo(routes.map)} />
      </Screen>
    );
  const local = event.source === 'local';
  return (
    <Screen
      title={local ? 'Aviso guardado' : 'Aviso en el mapa'}
      eyebrow="AVISO DEL RECORRIDO"
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
            backgroundColor: local
              ? colors.sage
              : event.source === 'rescatista'
                ? colors.paleRed
                : colors.paleAmber,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            name="pin"
            size={48}
            color={local ? colors.green : event.source === 'rescatista' ? colors.red : colors.amber}
          />
        </View>
        <Badge tone={local ? 'green' : event.source === 'rescatista' ? 'red' : 'amber'}>
          {trailEventSourceLabel(event.source)}
        </Badge>
        <Text style={[shared.body, { textAlign: 'center' }]}>
          {local
            ? 'Este aviso está guardado en este dispositivo. Aún no se comparte con otras personas.'
            : 'Este aviso está incluido en el mapa.'}
        </Text>
      </View>
      <View style={shared.card}>
        <DetailRow label="Tipo" value={trailEventTitle(event)} />
        <DetailRow
          label={event.description.trim() ? 'Descripción' : 'Causa'}
          value={trailEventCause(event)}
        />
        <DetailRow label="Lugar" value={event.point.label} />
        <DetailRow label="Origen" value={trailEventSourceLabel(event.source)} />
        <DetailRow
          label="Hora"
          value={new Date(event.createdAt).toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        />
      </View>
    </Screen>
  );
}
