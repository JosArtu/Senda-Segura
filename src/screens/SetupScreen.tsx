import { router } from 'expo-router';
import { Text } from 'react-native';

import { PermissionControls } from '@/components/PermissionControls';
import { ProfileForm } from '@/components/ProfileForm';
import { Screen } from '@/components/Screen';
import SendDownlink from '@/components/SendDownlink';
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
        Configura tu nombre y teléfono de contacto para incluirlos en tus solicitudes de ayuda.
      </Text>
      <ProfileForm submitLabel="Guardar y explorar" onSaved={explore} />
      <PermissionControls />
      <SendDownlink devId="prueba-abp" /> {/* NUEVO, temporal para la prueba */}
      <Button label="Continuar sin perfil" variant="secondary" onPress={explore} />
    </Screen>
  );
}