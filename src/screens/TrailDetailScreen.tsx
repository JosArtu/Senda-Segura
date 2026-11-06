import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { ForestMap } from '@/components/ForestMap';
import { Screen } from '@/components/Screen';
import { Button, DetailRow, Notice } from '@/components/ui';
import { shared } from '@/constants/theme';
import { trails } from '@/data/demo';
import { routes } from '@/navigation/routes';

export default function TrailDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trail = trails.find((item) => item.id === id);
  if (!trail)
    return (
      <Screen title="Ruta no encontrada" back>
        <Notice>Esta ruta no está disponible.</Notice>
        <Button label="Ver las rutas" onPress={() => router.replace(routes.trails)} />
      </Screen>
    );
  return (
    <Screen title={trail.name} eyebrow="DETALLE DEL SENDERO" back>
      <ForestMap compact />
      <Text style={shared.body}>{trail.description}</Text>
      <View style={shared.card}>
        <DetailRow label="Distancia" value={trail.distance} />
        <DetailRow label="Tiempo estimado" value={trail.duration} />
        <DetailRow label="Dificultad" value={trail.difficulty} />
      </View>
      <Button
        label="Preparar mapa sin conexión"
        icon="download"
        onPress={() => router.navigate(routes.offline)}
      />
    </Screen>
  );
}
