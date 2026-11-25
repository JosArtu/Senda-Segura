import { createApp } from './app.js';

const env = process.env;
const missing = ['TTN_APP_ID', 'TTN_API_KEY'].filter((name) => !env[name]);
if (missing.length > 0) {
  console.error(
    `Faltan variables de entorno: ${missing.join(', ')}. Copia .env.example a .env y complétalo.`,
  );
  process.exit(1);
}

const app = createApp({
  region: env.TTN_REGION || 'nam1',
  appId: env.TTN_APP_ID,
  apiKey: env.TTN_API_KEY,
  corsOrigins: (env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
});

const port = Number(env.PORT) || 3000;
app.listen(port, () => console.log(`Servidor escuchando en http://localhost:${port}`));
