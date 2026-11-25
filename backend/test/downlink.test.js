import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';

import { createApp } from '../app.js';

// Fake TTN: records each call and answers with `ttn.reply()`. No request leaves the machine.
const ttn = { calls: [], reply: () => new Response('{}', { status: 200 }) };
const fakeFetch = async (url, init) => {
  ttn.calls.push({ url, init, body: JSON.parse(init.body) });
  return ttn.reply();
};

let server;
let base;

function startApp(options = {}) {
  const app = createApp({
    region: 'nam1',
    appId: 'app-ficticia',
    apiKey: 'clave-ficticia',
    fetch: fakeFetch,
    ...options,
  });
  return new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
}

function post(body, headers = { 'Content-Type': 'application/json' }) {
  return fetch(`${base}/api/downlink`, {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

before(async () => {
  server = await startApp({ corsOrigins: ['http://localhost:8081'] });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
beforeEach(() => {
  ttn.calls = [];
  ttn.reply = () => new Response('{}', { status: 200 });
});

describe('allowlisted commands', () => {
  test('reboot queues ff10ff on FPort 85', async () => {
    const res = await post({ devId: 'prueba-abp', command: 'reboot' });
    assert.equal(res.status, 202);
    assert.deepEqual(await res.json(), {
      queued: true,
      hex: 'ff10ff',
      ttnStatus: 200,
      ttnBody: '{}',
    });
    assert.equal(ttn.calls.length, 1);
    const [{ url, init, body }] = ttn.calls;
    assert.equal(
      url,
      'https://nam1.cloud.thethings.network/api/v3/as/applications/app-ficticia/devices/prueba-abp/down/push',
    );
    assert.equal(init.headers.Authorization, 'Bearer clave-ficticia');
    assert.deepEqual(body.downlinks, [
      { f_port: 85, frm_payload: '/xD/', priority: 'NORMAL', confirmed: true },
    ]);
  });

  for (const [value, hex] of [
    [1, 'ff030100'],
    [60, 'ff033c00'],
    [65535, 'ff03ffff'],
  ]) {
    test(`setInterval ${value} encodes ${hex}`, async () => {
      const res = await post({ devId: 'prueba-abp', command: 'setInterval', value });
      assert.equal(res.status, 202);
      assert.equal((await res.json()).hex, hex);
    });
  }

  test('confirmed: false is forwarded', async () => {
    await post({ devId: 'prueba-abp', command: 'reboot', confirmed: false });
    assert.equal(ttn.calls[0].body.downlinks[0].confirmed, false);
  });
});

describe('rejected input never reaches TTN', () => {
  const cases = [
    ['unknown command', { devId: 'prueba-abp', command: 'borrar' }, 'Comando no permitido'],
    [
      'inherited key toString',
      { devId: 'prueba-abp', command: 'toString' },
      'Comando no permitido',
    ],
    [
      'inherited key constructor',
      { devId: 'prueba-abp', command: 'constructor' },
      'Comando no permitido',
    ],
    ['missing command', { devId: 'prueba-abp' }, 'Comando no permitido'],
    ['missing devId', { command: 'reboot' }, 'devId inválido'],
    [
      'path traversal devId',
      { devId: '../../otra-app/devices/x', command: 'reboot' },
      'devId inválido',
    ],
    ['uppercase devId', { devId: 'Prueba', command: 'reboot' }, 'devId inválido'],
    ['non-string devId', { devId: 42, command: 'reboot' }, 'devId inválido'],
    [
      'non-boolean confirmed',
      { devId: 'prueba-abp', command: 'reboot', confirmed: 'yes' },
      'confirmed debe ser booleano',
    ],
  ];
  for (const value of [undefined, 'abc', 0, -5, 1.5, 65536, 70000]) {
    cases.push([
      `setInterval value ${value}`,
      { devId: 'prueba-abp', command: 'setInterval', value },
      'value debe ser un entero de 1 a 65535 (segundos)',
    ]);
  }

  for (const [name, body, error] of cases) {
    test(name, async () => {
      const res = await post(body);
      assert.equal(res.status, 400);
      assert.deepEqual(await res.json(), { error });
      assert.equal(ttn.calls.length, 0);
    });
  }

  test('malformed JSON returns a JSON 400 without a stack trace', async () => {
    const res = await post('{bad');
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: 'Cuerpo JSON inválido' });
  });

  test('non-JSON body returns a JSON 400', async () => {
    const res = await post('devId=x', { 'Content-Type': 'application/x-www-form-urlencoded' });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: 'Comando no permitido' });
  });

  test('unknown route returns JSON 404', async () => {
    const res = await fetch(`${base}/api/otra`);
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'Ruta no encontrada' });
  });
});

describe('TTN failures', () => {
  test('TTN rejection returns 502 with queued: false', async () => {
    ttn.reply = () => new Response('{"code":7}', { status: 403 });
    const res = await post({ devId: 'prueba-abp', command: 'reboot' });
    assert.equal(res.status, 502);
    assert.deepEqual(await res.json(), {
      queued: false,
      hex: 'ff10ff',
      ttnStatus: 403,
      ttnBody: '{"code":7}',
    });
  });

  test('network failure returns a JSON 502', async () => {
    ttn.reply = () => {
      throw new TypeError('fetch failed');
    };
    const res = await post({ devId: 'prueba-abp', command: 'reboot' });
    assert.equal(res.status, 502);
    assert.deepEqual(await res.json(), {
      queued: false,
      hex: 'ff10ff',
      error: 'No se pudo contactar a TTN',
    });
  });
});

describe('CORS', () => {
  test('allowed origin receives CORS headers on preflight', async () => {
    const res = await fetch(`${base}/api/downlink`, {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:8081', 'Access-Control-Request-Method': 'POST' },
    });
    assert.equal(res.status, 204);
    assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:8081');
  });

  test('other origins receive no CORS headers', async () => {
    const res = await fetch(`${base}/api/downlink`, {
      method: 'OPTIONS',
      headers: { Origin: 'https://otro-sitio.example', 'Access-Control-Request-Method': 'POST' },
    });
    assert.equal(res.headers.get('access-control-allow-origin'), null);
  });

  test('CORS is off when no origins are configured', async () => {
    const s = await startApp();
    try {
      const res = await fetch(`http://127.0.0.1:${s.address().port}/api/downlink`, {
        method: 'OPTIONS',
        headers: { Origin: 'http://localhost:8081', 'Access-Control-Request-Method': 'POST' },
      });
      assert.equal(res.headers.get('access-control-allow-origin'), null);
    } finally {
      s.close();
    }
  });
});
