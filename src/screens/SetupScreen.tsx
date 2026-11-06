import { router } from 'expo-router';
import { Text } from 'react-native';

import { PermissionControls } from '@/components/PermissionControls';
import { ProfileForm } from '@/components/ProfileForm';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui';
import { shared } from '@/constants/theme';
import { useDemoSession } from '@/hooks/useDemoSession';
import { routes } from '@/navigation/routes';

export default function SetupScreen() {
  const { setHasStarted } = useDemoSession();
  const explore = () => {
    setHasStarted(true);
    router.replace(routes.map);
  };
  return (
    <Screen title="Antes de salir" eyebrow="TU PERFIL DE EMERGENCIA" back>
      <Text style={shared.body}>
        Un nombre y un teléfono ayudan al equipo de rescate a identificarte. Por ahora, probaremos
        el recorrido con datos de ejemplo.
      </Text>
      <ProfileForm submitLabel="Guardar y explorar" onSaved={explore} />
      <PermissionControls />
      <Button label="Continuar sin perfil" variant="secondary" onPress={explore} />
    </Screen>
  );
}
