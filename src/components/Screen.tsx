import { router } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { colors, shared } from '@/constants/theme';
import { routes } from '@/navigation/routes';

export function Screen({
  children,
  title,
  eyebrow = 'SENDA SEGURA',
  back = false,
  footer,
}: PropsWithChildren<{ title: string; eyebrow?: string; back?: boolean; footer?: ReactNode }>) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.demo}>
          <View style={styles.dot} />
          <Text style={styles.demoText}>PROTOTIPO · No envía alertas reales</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            {back && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Volver"
                onPress={() => (router.canGoBack() ? router.back() : router.replace(routes.map))}
                style={styles.back}
              >
                <Icon name="back" />
              </Pressable>
            )}
            <View style={{ flex: 1, gap: 7 }}>
              <Text style={shared.eyebrow}>{eyebrow}</Text>
              <Text accessibilityRole="header" style={shared.title}>
                {title}
              </Text>
            </View>
            {!back && (
              <View style={styles.brand}>
                <Icon name="tree" size={26} />
              </View>
            )}
          </View>
          {children}
        </ScrollView>
        {footer && (
          <SafeAreaView edges={['bottom']} style={styles.footer}>
            {footer}
          </SafeAreaView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  demo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 9,
    backgroundColor: colors.sage,
  },
  demoText: { color: colors.green, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.green },
  content: { padding: 24, gap: 22, paddingBottom: 36 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 2 },
  back: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brand: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    gap: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
});
