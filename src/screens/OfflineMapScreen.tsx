import { useState } from 'react';
import { Text, View } from 'react-native';

import { ForestMap } from '@/components/ForestMap';
import { Screen } from '@/components/Screen';
import { Badge, Button, DetailRow, Notice } from '@/components/ui';
import { shared } from '@/constants/theme';
import { demoMapPackage } from '@/data/demo';
import { useDemoSession } from '@/hooks/useDemoSession';

export default function OfflineMapScreen() {
  const { mapDownloaded, setMapDownloaded } = useDemoSession();
  const [message, setMessage] = useState('');
  return (
    <Screen title="Lleva el bosque contigo" eyebrow="MAPA SIN CONEXIÓN">
      <Text style={shared.body}>Prepara tu mapa antes de salir, mientras tengas conexión.</Text>
      <ForestMap compact />
      <View style={shared.card}>
        <Badge tone={mapDownloaded ? 'green' : 'amber'}>
          {mapDownloaded ? 'Preparado' : 'Por preparar'}
        </Badge>
        <Text style={shared.heading}>Bosque La Primavera</Text>
        <Text style={shared.body}>Senderos, zonas de riesgo y puntos de referencia.</Text>
        <DetailRow label="Versión" value={demoMapPackage.version} />
        <DetailRow label="Tamaño del paquete" value={demoMapPackage.size} />
        <Button
          label={mapDownloaded ? 'Buscar actualización' : 'Preparar mapa'}
          icon={mapDownloaded ? 'check' : 'download'}
          onPress={() => {
            setMapDownloaded(true);
            setMessage(mapDownloaded ? 'El mapa está actualizado.' : 'Mapa preparado.');
          }}
        />
        {mapDownloaded && (
          <Button
            label="Quitar mapa"
            variant="secondary"
            onPress={() => {
              setMapDownloaded(false);
              setMessage('Mapa eliminado de tu selección.');
            }}
          />
        )}
      </View>
      {message !== '' && (
        <View accessibilityLiveRegion="polite">
          <Notice>{message}</Notice>
        </View>
      )}
    </Screen>
  );
}
