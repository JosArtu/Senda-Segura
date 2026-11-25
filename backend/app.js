import { Buffer } from 'node:buffer';
import express from 'express';

// TTN end-device ID rules: lowercase letters, digits and single hyphens, 3–36 characters.
const DEVICE_ID = /^[a-z0-9](?:-?[a-z0-9]){2,35}$/;
const TTN_TIMEOUT_MS = 10_000;

const COMMANDS = new Map([
  ['reboot', { encode: () => 'ff10ff' }],
  [
    'setInterval',
    {
      // Interval in seconds, sent as uint16 little-endian.
      validate: (value) =>
        Number.isInteger(value) && value >= 1 && value <= 0xffff
          ? null
          : 'value debe ser un entero de 1 a 65535 (segundos)',
      encode: (value) => {
        const b = Buffer.alloc(2);
        b.writeUInt16LE(value);
        return 'ff03' + b.toString('hex');
      },
    },
  ],
]);

/**
 * @param {object} config
 * @param {string} config.region TTN cluster, e.g. "nam1".
 * @param {string} config.appId TTN application ID.
 * @param {string} config.apiKey TTN API key with downlink-write rights.
 * @param {string[]} [config.corsOrigins] Browser origins allowed to call the API.
 * @param {typeof fetch} [config.fetch] Injected for tests.
 */
export function createApp({ region, appId, apiKey, corsOrigins = [], fetch = globalThis.fetch }) {
  const app = express();
  app.disable('x-powered-by');

  if (corsOrigins.length > 0) {
    app.use((req, res, next) => {
      const origin = req.get('Origin');
      if (origin && corsOrigins.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin);
        res.set('Vary', 'Origin');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
      }
      if (req.method === 'OPTIONS') return res.sendStatus(204);
      next();
    });
  }

  app.use(express.json({ limit: '1kb' }));

  app.post('/api/downlink', async (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { devId, command, value, confirmed = true } = body;

    if (typeof command !== 'string' || !COMMANDS.has(command)) {
      return res.status(400).json({ error: 'Comando no permitido' });
    }
    if (typeof devId !== 'string' || !DEVICE_ID.test(devId)) {
      return res.status(400).json({ error: 'devId inválido' });
    }
    if (typeof confirmed !== 'boolean') {
      return res.status(400).json({ error: 'confirmed debe ser booleano' });
    }
    const spec = COMMANDS.get(command);
    const invalid = spec.validate?.(value);
    if (invalid) return res.status(400).json({ error: invalid });

    const hex = spec.encode(value);
    const url =
      `https://${region}.cloud.thethings.network/api/v3/as/applications/` +
      `${encodeURIComponent(appId)}/devices/${encodeURIComponent(devId)}/down/push`;

    let r;
    try {
      r = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          downlinks: [
            {
              f_port: 85,
              frm_payload: Buffer.from(hex, 'hex').toString('base64'),
              priority: 'NORMAL',
              confirmed,
            },
          ],
        }),
        signal: AbortSignal.timeout(TTN_TIMEOUT_MS),
      });
    } catch (err) {
      console.error('No se pudo contactar a TTN:', err.message);
      return res.status(502).json({ queued: false, hex, error: 'No se pudo contactar a TTN' });
    }

    const ttnBody = await r.text();
    if (!r.ok) console.error('TTN respondió', r.status, ttnBody);
    res.status(r.ok ? 202 : 502).json({ queued: r.ok, hex, ttnStatus: r.status, ttnBody });
  });

  app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

  // Express error handler (4 args). Never send stack traces to clients.
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed' || err.type === 'entity.too.large') {
      return res.status(err.status ?? 400).json({ error: 'Cuerpo JSON inválido' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  });

  return app;
}
