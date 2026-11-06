import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ForestMap } from '@/components/ForestMap';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Badge, Button, Notice, SectionTitle } from '@/components/ui';
import { colors, shared } from '@/constants/theme';
import { emergencyCategories } from '@/data/demo';
import { useDemoSession } from '@/hooks/useDemoSession';
import { routes } from '@/navigation/routes';

export default function MapScreen() {
  const { profile, permissions, mapDownloaded, alerts } = useDemoSession();
  const pending = alerts.filter((alert) => alert.outcome === 'pending');
  return (
    <Screen title="Encuentra tu camino" eyebrow="BOSQUE LA PRIMAVERA">
      <Text style={[shared.body, { marginTop: -12 }]}>
        {profile.name ? `Hola, ${profile.name}. ` : ''}El bosque te espera. Explora con cuidado.
      </Text>
      <View style={[shared.row, { flexWrap: 'wrap', gap: 8 }]}>
        <Badge tone={permissions.location ? 'green' : 'amber'}>
          {permissions.location ? 'Ubicación en el mapa' : 'Ubicación desactivada'}
        </Badge>
        <Badge tone={mapDownloaded ? 'green' : 'amber'}>
          {mapDownloaded ? 'Mapa preparado' : 'Mapa sin preparar'}
        </Badge>
      </View>
      <ForestMap />
      <View style={{ gap: 8 }}>
        <Button
          label="Pedir ayuda"
          icon="shield"
          variant="danger"
          onPress={() => router.push(routes.emergency)}
        />
      </View>
      {!permissions.location && (
        <Notice warning>
          La ubicación está desactivada en tus preferencias. Puedes cambiarla en Perfil.
        </Notice>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Preparar mi mapa"
        onPress={() => router.navigate(routes.offline)}
        style={[shared.card, shared.row]}
      >
        <View style={styles.download}>
          <Icon name="download" />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={shared.label}>Antes de desconectarte</Text>
          <Text style={[shared.body, { fontSize: 12 }]}>Prepara tu mapa para el recorrido.</Text>
        </View>
        <Icon name="arrow" size={20} />
      </Pressable>
      <SectionTitle
        title="Tus solicitudes"
        trailing={
          <Badge>
            {alerts.length} {alerts.length === 1 ? 'solicitud' : 'solicitudes'}
          </Badge>
        }
      />
      {pending.length === 0 ? (
        <Text style={shared.body}>No tienes solicitudes pendientes.</Text>
      ) : (
        pending.map((alert) => (
          <Pressable
            key={alert.id}
            accessibilityRole="button"
            accessibilityLabel="Ver alerta pendiente"
            onPress={() => router.push({ pathname: routes.result, params: { id: alert.id } })}
            style={[shared.card, shared.row]}
          >
            <Icon name="clock" color={colors.amber} />
            <View style={{ flex: 1 }}>
              <Text style={shared.label}>
                {emergencyCategories.find((category) => category.id === alert.category)?.title}
              </Text>
              <Text style={shared.body}>Pendiente de envío</Text>
            </View>
            <Icon name="arrow" />
          </Pressable>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  download: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.sage,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
