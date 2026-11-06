import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Badge, SectionTitle } from '@/components/ui';
import { colors, shared } from '@/constants/theme';
import { safetyTips, trails } from '@/data/demo';

export default function TrailsScreen() {
  return (
    <Screen title="Rutas y seguridad" eyebrow="EXPLORA CON CUIDADO">
      <Text style={shared.body}>
        Cada sendero es diferente. Conoce el recorrido antes de dar el primer paso.
      </Text>
      <SectionTitle title="Senderos del bosque" trailing={<Badge>{trails.length} rutas</Badge>} />
      {trails.map((trail, index) => (
        <Pressable
          key={trail.id}
          accessibilityRole="button"
          accessibilityLabel={`Ver ${trail.name}`}
          onPress={() => router.push({ pathname: '/trail/[id]', params: { id: trail.id } })}
          style={({ pressed }) => [shared.card, { opacity: pressed ? 0.7 : 1 }]}
        >
          <View style={[shared.row, { justifyContent: 'space-between' }]}>
            <Icon name="mountain" size={30} />
            <Text style={[shared.eyebrow, { color: colors.muted }]}>RUTA 0{index + 1}</Text>
          </View>
          <Text style={shared.heading}>{trail.name}</Text>
          <Text style={shared.body}>
            {trail.distance} · {trail.duration}
          </Text>
          <View style={[shared.row, { justifyContent: 'space-between' }]}>
            <Badge
              tone={trail.risk === 'high' ? 'red' : trail.risk === 'medium' ? 'amber' : 'green'}
            >
              {trail.difficulty} · Riesgo{' '}
              {trail.risk === 'high' ? 'alto' : trail.risk === 'medium' ? 'medio' : 'bajo'}
            </Badge>
            <Icon name="arrow" size={20} />
          </View>
        </Pressable>
      ))}
      <View
        style={[
          shared.card,
          { backgroundColor: colors.forest, borderColor: colors.forest, gap: 16 },
        ]}
      >
        <Text style={[shared.heading, { color: colors.white }]}>Antes de salir</Text>
        {safetyTips.map((tip) => (
          <View key={tip} style={shared.row}>
            <Icon name="check" size={17} color="#BDCEB3" />
            <Text style={[shared.body, { color: '#E0E8DB', flex: 1 }]}>{tip}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
