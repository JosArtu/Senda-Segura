import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui';
import { colors, shared } from '@/constants/theme';
import { trailEventCategories, trailEventLimits } from '@/data/demo';
import { useDemoSession } from '@/hooks/useDemoSession';
import { routes } from '@/navigation/routes';
import type { TrailEventCategory } from '@/types/domain';

function ready(category: TrailEventCategory | null, description: string, customTitle: string) {
  if (!category) return false;
  if (category !== 'other') return true;
  const title = customTitle.trim();
  const text = description.trim();
  return (
    title.length > 0 &&
    title.length <= trailEventLimits.title &&
    text.length > 0 &&
    text.length <= trailEventLimits.description
  );
}

export default function ReportEventScreen() {
  const { trailEventDraft, setTrailEventDraft } = useDemoSession();
  const [category, setCategory] = useState<TrailEventCategory | null>(
    trailEventDraft?.category ?? null,
  );
  const [description, setDescription] = useState(trailEventDraft?.description ?? '');
  const [customTitle, setCustomTitle] = useState(trailEventDraft?.customTitle ?? '');
  const cancel = () => {
    setTrailEventDraft(null);
    router.dismissTo(routes.map);
  };
  return (
    <Screen
      title="¿Qué encontraste?"
      eyebrow="REPORTAR UN EVENTO · PASO 1 DE 2"
      back
      footer={
        <>
          <Button
            label="Continuar"
            disabled={!ready(category, description, customTitle)}
            icon="arrow"
            onPress={() => {
              if (!category || !ready(category, description, customTitle)) return;
              setTrailEventDraft({
                category,
                description: description.trim(),
                customTitle: category === 'other' ? customTitle.trim() : undefined,
              });
              router.push(routes.placeEvent);
            }}
          />
          <Button label="Cancelar y volver al mapa" variant="secondary" onPress={cancel} />
        </>
      }
    >
      <Text style={shared.body}>
        Elige el tipo de evento. Si es otro, ponle nombre y describe lo que viste.
      </Text>
      {trailEventCategories.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="radio"
          accessibilityLabel={item.title}
          accessibilityState={{ checked: item.id === category }}
          onPress={() => setCategory(item.id)}
          style={[
            shared.card,
            shared.row,
            {
              minHeight: 92,
              borderColor: item.id === category ? colors.green : colors.border,
              backgroundColor: item.id === category ? colors.sage : colors.white,
            },
          ]}
        >
          <Icon name={item.icon} size={30} />
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={shared.label}>{item.title}</Text>
            <Text style={[shared.body, { fontSize: 13 }]}>{item.description}</Text>
          </View>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 1.5,
              borderColor: colors.green,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {item.id === category && (
              <View
                style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.green }}
              />
            )}
          </View>
        </Pressable>
      ))}
      {category === 'other' && (
        <View style={{ gap: 8 }}>
          <Text style={shared.label}>Nombre del evento</Text>
          <TextInput
            accessibilityLabel="Nombre del evento"
            value={customTitle}
            onChangeText={setCustomTitle}
            placeholder="Describe el tipo en pocas palabras"
            placeholderTextColor={colors.muted}
            maxLength={trailEventLimits.title}
            style={shared.input}
          />
          <Text style={shared.label}>Descripción</Text>
          <TextInput
            accessibilityLabel="Descripción"
            value={description}
            onChangeText={setDescription}
            placeholder="Qué hay en el camino y cómo afecta el paso"
            placeholderTextColor={colors.muted}
            maxLength={trailEventLimits.description}
            multiline
            style={[shared.input, { minHeight: 110, textAlignVertical: 'top' }]}
          />
        </View>
      )}
    </Screen>
  );
}
