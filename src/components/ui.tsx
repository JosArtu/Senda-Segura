import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { colors, shared } from '@/constants/theme';

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: IconName;
  disabled?: boolean;
}) {
  const foreground = variant === 'secondary' ? colors.green : colors.white;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor:
            variant === 'danger'
              ? colors.red
              : variant === 'secondary'
                ? colors.sage
                : colors.green,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
        },
      ]}
    >
      {icon && <Icon name={icon} color={foreground} size={22} />}
      <Text style={[styles.buttonText, { color: foreground }]}>{label}</Text>
    </Pressable>
  );
}

export function Badge({
  children,
  tone = 'green',
}: PropsWithChildren<{ tone?: 'green' | 'amber' | 'red' }>) {
  const foreground = tone === 'amber' ? colors.amber : tone === 'red' ? colors.red : colors.green;
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor:
            tone === 'amber' ? colors.paleAmber : tone === 'red' ? colors.paleRed : colors.sage,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: foreground }]}>{children}</Text>
    </View>
  );
}

export function Notice({ children, warning = false }: PropsWithChildren<{ warning?: boolean }>) {
  return (
    <View style={[styles.notice, warning && { backgroundColor: colors.paleAmber }]}>
      <Text style={[styles.noticeText, warning && { color: colors.amber }]}>{children}</Text>
    </View>
  );
}

export function SectionTitle({ title, trailing }: { title: string; trailing?: ReactNode }) {
  return (
    <View style={[shared.row, { justifyContent: 'space-between' }]}>
      <Text accessibilityRole="header" style={[shared.heading, { flex: 1 }]}>
        {title}
      </Text>
      {trailing}
    </View>
  );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={[shared.body, { flex: 1 }]}>{label}</Text>
      <Text style={[shared.label, { flex: 1.5, textAlign: 'right' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: { fontSize: 15, fontWeight: '700', textAlign: 'center', flexShrink: 1 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  notice: { borderRadius: 12, backgroundColor: colors.sage, padding: 14 },
  noticeText: { fontSize: 13, lineHeight: 20, color: colors.green },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
});
