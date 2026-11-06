import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ForestMap } from '@/components/ForestMap';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Badge, Button, Notice, SectionTitle } from '@/components/ui';
import { colors, shared } from '@/constants/theme';
import { demoLocation, emergencyCategories } from '@/data/demo';
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
          {permissions.location
            ? `GPS de ejemplo ${demoLocation.accuracy}`
            : 'GPS desactivado · demo'}
        </Badge>
        <Badge tone={mapDownloaded ? 'green' : 'amber'}>
          {mapDownloaded ? 'Mapa preparado · demo' : 'Mapa sin preparar · demo'}
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
        <Text style={styles.sosCaption}>Prueba el flujo SOS. No se contactará a rescate.</Text>
      </View>
      {!permissions.location && (
        <Notice warning>
          La ubicación de ejemplo está desactivada. Puedes cambiarla en Perfil; no se está leyendo
          el GPS del teléfono.
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
      <SectionTitle title="Tu sesión" trailing={<Badge>{alerts.length} SOS de prueba</Badge>} />
      {pending.length === 0 ? (
        <Text style={shared.body}>No tienes alertas de prueba pendientes.</Text>
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
              <Text style={shared.body}>Pendiente · simulación</Text>
            </View>
            <Icon name="arrow" />
          </Pressable>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  sosCaption: { fontSize: 11, textAlign: 'center', color: colors.muted },
  download: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.sage,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
