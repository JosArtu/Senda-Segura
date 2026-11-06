import { expect, test, type Page } from '@playwright/test';

async function enterMap(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Explorar sin perfil', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Encuentra tu camino' })).toBeVisible();
}

async function startEmergency(page: Page) {
  await page.getByRole('button', { name: 'Pedir ayuda', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Continuar', exact: true })).toBeDisabled();
  await page.getByRole('radio', { name: 'Lesión o malestar' }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Confirma tu solicitud' })).toBeVisible();
}

test('profile setup validates input and tab navigation shares session state', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click();
  await page.getByRole('button', { name: 'Volver', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Senda Segura', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click();
  await page.getByRole('button', { name: 'Guardar y explorar' }).click();
  await expect(page.getByText('Escribe un nombre y un teléfono', { exact: false })).toBeVisible();
  await page.getByRole('textbox', { name: 'Nombre', exact: true }).fill('Visitante de prueba');
  await page.getByRole('textbox', { name: 'Teléfono celular', exact: true }).fill('0000000000');
  await page.getByRole('button', { name: 'Guardar y explorar' }).click();
  await expect(page.getByText('Hola, Visitante de prueba.', { exact: false })).toBeVisible();
  await page.getByRole('tab', { name: 'Rutas', exact: true }).click();
  await page.getByRole('button', { name: 'Ver Sendero Río Caliente' }).click();
  await expect(page.getByRole('heading', { name: 'Sendero Río Caliente' })).toBeVisible();
  await page.getByRole('button', { name: 'Volver', exact: true }).click();
  await page.getByRole('tab', { name: 'Sin conexión', exact: true }).click();
  await page.getByRole('button', { name: 'Simular descarga del mapa' }).click();
  await page.getByRole('tab', { name: 'Mapa', exact: true }).click();
  await expect(page.getByText('Mapa preparado · demo')).toBeVisible();
  await page.getByRole('tab', { name: 'Perfil', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Nombre', exact: true })).toHaveValue(
    'Visitante de prueba',
  );
  await page.getByRole('textbox', { name: 'Nombre', exact: true }).fill('Perfil editado');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await page.getByRole('switch', { name: 'Ubicación GPS de ejemplo' }).click();
  await page.getByRole('tab', { name: 'Mapa', exact: true }).click();
  await expect(page.getByText('GPS desactivado · demo')).toBeVisible();
  await expect(page.getByText('Hola, Perfil editado.', { exact: false })).toBeVisible();
  expect(errors).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('map-preview.png') });
});

test('SOS cancellation creates no alert, and pending delivery can be simulated once', async ({
  page,
}) => {
  await enterMap(page);
  await startEmergency(page);
  await page.getByRole('button', { name: 'Cancelar y volver al mapa' }).click();
  await expect(page.getByText('0 SOS de prueba')).toBeVisible();
  await startEmergency(page);
  await page.getByRole('radio', { name: 'Sin conexión', exact: true }).click();
  await page.getByRole('button', { name: 'Simular envío de alerta' }).click();
  await expect(page.getByRole('heading', { name: 'Alerta de prueba pendiente' })).toBeVisible();
  await page.getByRole('button', { name: 'Volver al mapa' }).click();
  await expect(page.getByText('1 SOS de prueba')).toBeVisible();
  await page.getByRole('button', { name: 'Ver alerta pendiente' }).click();
  await page.getByRole('button', { name: 'Simular recuperación y recepción' }).click();
  await expect(page.getByRole('heading', { name: 'Recepción simulada' })).toBeVisible();
  await page.getByRole('button', { name: 'Volver al mapa' }).click();
  await expect(page.getByText('1 SOS de prueba')).toBeVisible();
  await expect(page.getByText('No tienes alertas de prueba pendientes.')).toBeVisible();
});

test('confirmed demo result resets on reload and invalid links recover safely', async ({
  page,
}) => {
  await enterMap(page);
  await startEmergency(page);
  await page.getByRole('button', { name: 'Simular envío de alerta' }).click();
  await expect(page.getByRole('heading', { name: 'Recepción simulada' })).toBeVisible();
  await expect(
    page.getByText('Ningún equipo de rescate recibió esta alerta.', { exact: false }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Sin alerta de prueba' })).toBeVisible();
  await page.getByRole('button', { name: 'Volver al mapa' }).click();
  await expect(page.getByText('0 SOS de prueba')).toBeVisible();
  await page.goto('/sos/confirm?category=invalid');
  await expect(page.getByRole('heading', { name: '¿Qué está pasando?' })).toBeVisible();
  await page.goto('/trail/missing');
  await expect(page.getByRole('heading', { name: 'Ruta no encontrada' })).toBeVisible();
  await page.goto('/missing-screen');
  await expect(page.getByRole('heading', { name: 'Ese camino no existe' })).toBeVisible();
});
