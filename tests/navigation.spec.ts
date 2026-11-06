import { expect, test, type Page } from '@playwright/test';

async function expectProductCopy(page: Page) {
  await expect(page.locator('body')).not.toContainText(
    /prototipo|simulad[oa]|simulaci[oó]n|demostraci[oó]n|de ejemplo|de prueba/i,
  );
}

async function enterMap(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Explorar sin perfil', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Encuentra tu camino' })).toBeVisible();
  await expectProductCopy(page);
}

async function startEmergency(page: Page) {
  await page.getByRole('button', { name: 'Pedir ayuda', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Continuar', exact: true })).toBeDisabled();
  await page.getByRole('radio', { name: 'Lesión o malestar' }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Confirma tu solicitud' })).toBeVisible();
  await expectProductCopy(page);
}

test('profile setup validates input and tab navigation shares session state', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expectProductCopy(page);
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click();
  await page.getByRole('button', { name: 'Volver', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Senda Segura', exact: true })).toBeVisible();
  await expectProductCopy(page);
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click();
  await expectProductCopy(page);
  await page.getByRole('button', { name: 'Guardar y explorar' }).click();
  await expect(page.getByText('Escribe un nombre y un teléfono', { exact: false })).toBeVisible();
  await page.getByRole('textbox', { name: 'Nombre', exact: true }).fill('Visitante');
  await page.getByRole('textbox', { name: 'Teléfono celular', exact: true }).fill('0000000000');
  await expectProductCopy(page);
  await page.getByRole('button', { name: 'Guardar y explorar' }).click();
  await expect(page.getByText('Hola, Visitante.', { exact: false })).toBeVisible();
  await page.getByRole('tab', { name: 'Rutas', exact: true }).click();
  await expectProductCopy(page);
  await page.getByRole('button', { name: 'Ver Sendero Río Caliente' }).click();
  await expect(page.getByRole('heading', { name: 'Sendero Río Caliente' })).toBeVisible();
  await expectProductCopy(page);
  await page.getByRole('button', { name: 'Volver', exact: true }).click();
  await page.getByRole('tab', { name: 'Sin conexión', exact: true }).click();
  await expectProductCopy(page);
  await page.getByRole('button', { name: 'Preparar mapa' }).click();
  await expectProductCopy(page);
  await page.getByRole('tab', { name: 'Mapa', exact: true }).click();
  await expect(page.getByText('Mapa preparado', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Perfil', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Nombre', exact: true })).toHaveValue('Visitante');
  await page.getByRole('textbox', { name: 'Nombre', exact: true }).fill('Perfil editado');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await page.getByRole('switch', { name: 'Ubicación GPS' }).click();
  await page.getByRole('tab', { name: 'Mapa', exact: true }).click();
  await expect(page.getByText('Ubicación desactivada')).toBeVisible();
  await expect(page.getByText('Hola, Perfil editado.', { exact: false })).toBeVisible();
  await expectProductCopy(page);
  expect(errors).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('map-preview.png') });
});

test('SOS cancellation and retry stay local without claiming receipt', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.protocol.startsWith('http') && !['127.0.0.1', 'localhost'].includes(url.hostname)) {
      externalRequests.push(request.url());
    }
  });
  await enterMap(page);
  await startEmergency(page);
  await page.getByRole('button', { name: 'Cancelar y volver al mapa' }).click();
  await expect(page.getByText('0 solicitudes')).toBeVisible();
  await startEmergency(page);
  await page.getByRole('button', { name: 'Solicitar ayuda', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Solicitud pendiente' })).toBeVisible();
  await expect(
    page.getByText('Tu solicitud está pendiente de envío.', { exact: false }),
  ).toBeVisible();
  await expectProductCopy(page);
  await page.getByRole('button', { name: 'Volver al mapa' }).click();
  await expect(page.getByText('1 solicitud')).toBeVisible();
  await page.getByRole('button', { name: 'Ver alerta pendiente' }).click();
  await page.getByRole('button', { name: 'Reintentar envío' }).click();
  await page.getByRole('button', { name: 'Reintentar envío' }).click();
  await expect(
    page.getByText('El servicio de envío no está disponible.', { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Solicitud pendiente' })).toBeVisible();
  await expectProductCopy(page);
  await page.getByRole('button', { name: 'Volver al mapa' }).click();
  await expect(page.getByText('1 solicitud')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ver alerta pendiente' })).toHaveCount(1);
  expect(externalRequests).toEqual([]);
});

test('local requests reset on reload and invalid links recover safely', async ({ page }) => {
  await enterMap(page);
  await startEmergency(page);
  await page.getByRole('button', { name: 'Solicitar ayuda', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Solicitud pendiente' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Solicitud no disponible' })).toBeVisible();
  await expectProductCopy(page);
  await page.getByRole('button', { name: 'Volver al mapa' }).click();
  await expect(page.getByText('0 solicitudes')).toBeVisible();
  await page.goto('/sos/confirm?category=invalid');
  await expect(page.getByRole('heading', { name: '¿Qué está pasando?' })).toBeVisible();
  await expectProductCopy(page);
  await page.goto('/trail/missing');
  await expect(page.getByRole('heading', { name: 'Ruta no encontrada' })).toBeVisible();
  await expectProductCopy(page);
  await page.goto('/missing-screen');
  await expect(page.getByRole('heading', { name: 'Ese camino no existe' })).toBeVisible();
  await expectProductCopy(page);
});
