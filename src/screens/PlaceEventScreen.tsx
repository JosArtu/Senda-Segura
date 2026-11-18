import { Redirect, router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ForestMap } from '@/components/ForestMap';
import { Screen } from '@/components/Screen';
import { Button, DetailRow } from '@/components/ui';
import { colors, shared } from '@/constants/theme';
import { currentMapPoint, labelForMapPoint, trailEventTitle } from '@/data/demo';
import { useDemoSession } from '@/hooks/useDemoSession';
import { routes } from '@/navigation/routes';
import type { MapPoint } from '@/types/domain';

export default function PlaceEventScreen() {
  const { trailEventDraft, setTrailEventDraft, createTrailEvent } = useDemoSession();
  const [point, setPoint] = useState<MapPoint | null>(null);
  const [saved, setSaved] = useState(false);
  const submitted = useRef(false);
  if (!trailEventDraft) {
    if (saved) return null;
    return <Redirect href={routes.reportEvent} />;
  }
  const draft = trailEventDraft;
  const cancel = () => {
    setTrailEventDraft(null);
    router.dismissTo(routes.map);
  };
  const save = () => {
    if (!point || submitted.current) return;
    submitted.current = true;
    setSaved(true);
    const id = createTrailEvent(draft, point);
    if (!id) {
      submitted.current = false;
      setSaved(false);
      return;
    }
    router.replace({ pathname: routes.trailEvent, params: { id } });
  };
  return (
    <Screen
      title="Ubica el aviso"
      eyebrow="REPORTAR UN EVENTO · PASO 2 DE 2"
      back
      footer={
        <>
          <Button label="Guardar aviso" icon="check" disabled={!point} onPress={save} />
          <Button label="Cancelar y volver al mapa" variant="secondary" onPress={cancel} />
        </>
      }
    >
      <Text style={shared.body}>Toca el mapa para marcar el lugar, o usa tu ubicación.</Text>
      <ForestMap
        markers={[]}
        selectedPoint={point}
        onPlace={(next) => setPoint({ ...next, label: labelForMapPoint(next.x, next.y) })}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={currentMapPoint.label}
        accessibilityState={{ selected: point?.label === currentMapPoint.label }}
        onPress={() => setPoint(currentMapPoint)}
        style={{
          minHeight: 54,
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: point?.label === currentMapPoint.label ? colors.green : colors.border,
          backgroundColor: point?.label === currentMapPoint.label ? colors.sage : colors.white,
          alignItems: 'center',
        }}
      >
        <Text style={shared.label}>{currentMapPoint.label}</Text>
      </Pressable>
      <View style={shared.card} accessibilityLiveRegion="polite">
        <DetailRow label="Tipo" value={trailEventTitle(draft)} />
        {draft.description.trim() !== '' && (
          <DetailRow label="Descripción" value={draft.description} />
        )}
        <DetailRow label="Lugar" value={point?.label ?? 'Sin elegir'} />
      </View>
    </Screen>
  );
}
