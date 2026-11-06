import { router } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Button, Notice } from '@/components/ui';
import { routes } from '@/navigation/routes';

export default function NotFoundScreen() {
  return (
    <Screen title="Ese camino no existe" back>
      <Notice>La pantalla que buscas no forma parte de este prototipo.</Notice>
      <Button label="Volver al mapa" onPress={() => router.replace(routes.map)} />
    </Screen>
  );
}
