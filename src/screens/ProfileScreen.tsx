import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { PermissionControls } from '@/components/PermissionControls';
import { ProfileForm } from '@/components/ProfileForm';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui';
import { shared } from '@/constants/theme';
import { routes } from '@/navigation/routes';

export default function ProfileScreen() {
  return (
    <Screen title="Perfil y ajustes" eyebrow="TU COMPAÑERO DE RUTA">
      <Text style={shared.body}>
        Mantén tus datos de contacto al día y configura tus preferencias.
      </Text>
      <ProfileForm submitLabel="Guardar cambios" />
      <PermissionControls />
      <View style={shared.stack}>
        <Button
          label="Información de seguridad"
          icon="compass"
          variant="secondary"
          onPress={() => router.navigate(routes.trails)}
        />
        <Button
          label="Administrar mapa sin conexión"
          icon="download"
          variant="secondary"
          onPress={() => router.navigate(routes.offline)}
        />
      </View>
      <Text style={[shared.body, { textAlign: 'center', fontSize: 12 }]}>
        Senda Segura · 0.1.0{'\n'}Más Bosque Manu · Bosque La Primavera
      </Text>
    </Screen>
  );
}
