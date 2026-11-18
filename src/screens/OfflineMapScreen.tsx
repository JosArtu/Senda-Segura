import { Text, View } from 'react-native';

import { ForestMap } from '@/components/ForestMap';
import { Screen } from '@/components/Screen';
import { Badge, Notice } from '@/components/ui';
import { shared } from '@/constants/theme';

export default function OfflineMapScreen() {
  return (
    <Screen title="Lleva el bosque contigo" eyebrow="MAPA SIN CONEXIÓN">
      <Text style={shared.body}>Prepara tu mapa antes de salir, mientras tengas conexión.</Text>
      <ForestMap compact />
      <View style={shared.card}>
        <Badge tone="amber">Sin paquete</Badge>
        <Text style={shared.heading}>Bosque La Primavera</Text>
        <Text style={shared.body}>
          Senderos, zonas de riesgo, puntos de referencia y avisos del recorrido.
        </Text>
      </View>
      <Notice>
        La descarga y la actualización del mapa todavía no están disponibles en la app.
      </Notice>
    </Screen>
  );
}
