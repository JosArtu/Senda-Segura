import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ForestMap } from '@/components/ForestMap';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui';
import { colors, serif, shared } from '@/constants/theme';
import { useDemoSession } from '@/hooks/useDemoSession';
import { routes } from '@/navigation/routes';

export default function WelcomeScreen() {
  const { hasStarted, setHasStarted } = useDemoSession();
  return (
    <Screen
      title="Senda Segura"
      eyebrow="BOSQUE LA PRIMAVERA"
      footer={
        <>
          <Button
            label={hasStarted ? 'Continuar al mapa' : 'Comenzar'}
            icon="arrow"
            onPress={() => (hasStarted ? router.replace(routes.map) : router.push(routes.setup))}
          />
          <Button
            label="Explorar sin perfil"
            variant="secondary"
            onPress={() => {
              setHasStarted(true);
              router.replace(routes.map);
            }}
          />
        </>
      }
    >
      <View style={styles.hero}>
        <View style={styles.mark}>
          <Icon name="tree" color="#E1EBCF" size={40} />
        </View>
        <Text style={styles.headline}>Tu camino,{'\n'}con más calma.</Text>
        <Text style={styles.copy}>
          Explora el bosque. Conoce tu ruta.{'\n'}Ten la ayuda siempre a la vista.
        </Text>
        <View style={styles.rule} />
        <Text style={styles.partner}>JUNTO A MÁS BOSQUE MANU</Text>
      </View>
      <ForestMap compact />
      <View style={[shared.row, { justifyContent: 'space-between' }]}>
        {[
          ['map', 'Mapas offline'],
          ['shield', 'Auxilio a la mano'],
          ['compass', 'Rutas y seguridad'],
        ].map(([icon, label]) => (
          <View key={label} style={{ flex: 1, alignItems: 'center', gap: 8 }}>
            <Icon name={icon as 'map' | 'shield' | 'compass'} size={20} />
            <Text style={styles.feature}>{label}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.forest, borderRadius: 24, padding: 28, gap: 20 },
  mark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#5D7D64',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: { fontFamily: serif, fontSize: 40, lineHeight: 45, color: '#F4F4E8' },
  copy: { color: '#CDDACB', fontSize: 15, lineHeight: 24 },
  rule: { width: 42, height: 1, backgroundColor: '#8B9D7C' },
  partner: { fontSize: 9, letterSpacing: 2, color: '#BDCEB3', fontWeight: '600' },
  feature: { fontSize: 10, color: colors.green, textAlign: 'center' },
});
