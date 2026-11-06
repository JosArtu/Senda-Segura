import { Platform, StyleSheet } from 'react-native';

export const colors = {
  forest: '#153E32',
  green: '#286448',
  sage: '#E6EDE1',
  cream: '#F6F5EF',
  white: '#FFFFFF',
  ink: '#203A30',
  muted: '#637168',
  border: '#DCE2D7',
  red: '#B42D3E',
  paleRed: '#FBECEF',
  amber: '#805619',
  paleAmber: '#FFF3D9',
  blue: '#356B8D',
};

export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });

export const shared = StyleSheet.create({
  title: { fontFamily: serif, fontSize: 32, lineHeight: 38, color: colors.ink },
  heading: { fontFamily: serif, fontSize: 23, lineHeight: 29, color: colors.ink },
  body: { fontSize: 15, lineHeight: 23, color: colors.muted },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: colors.ink },
  eyebrow: { fontSize: 11, letterSpacing: 2, fontWeight: '700', color: colors.green },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stack: { gap: 16 },
  card: {
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: colors.ink,
  },
});
