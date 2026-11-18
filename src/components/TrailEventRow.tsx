import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, shared } from '@/constants/theme';
import { trailEventSourceLabel, trailEventTitle } from '@/data/demo';
import { routes } from '@/navigation/routes';
import type { TrailEvent } from '@/types/domain';

export function TrailEventRow({ event, nested = false }: { event: TrailEvent; nested?: boolean }) {
  const title = trailEventTitle(event);
  const tone =
    event.source === 'rescatista'
      ? colors.red
      : event.source === 'local'
        ? colors.green
        : colors.amber;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver aviso ${title}`}
      onPress={() => router.push({ pathname: routes.trailEvent, params: { id: event.id } })}
      style={[nested ? shared.row : shared.card, nested && { paddingVertical: 8 }]}
    >
      <Icon name="pin" color={tone} />
      <View style={{ flex: 1 }}>
        <Text style={shared.label}>{title}</Text>
        <Text style={shared.body}>{trailEventSourceLabel(event.source)}</Text>
      </View>
      <Icon name="arrow" size={20} />
    </Pressable>
  );
}
