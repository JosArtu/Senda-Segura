const API_URL = process.env.EXPO_PUBLIC_API_URL;

type DownlinkResponse = {
  queued?: boolean;
  hex?: string;
  ttnStatus?: number;
  error?: string;
};

export async function sendDownlink(
  devId: string,
  command: 'reboot' | 'setInterval',
  value?: number,
): Promise<DownlinkResponse> {
  if (!API_URL) throw new Error('El servidor de comandos no está configurado');

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/downlink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ devId, command, value }),
    });
  } catch {
    throw new Error('Sin conexión con el servidor de comandos');
  }

  let data: DownlinkResponse = {};
  try {
    data = (await res.json()) as DownlinkResponse;
  } catch {
    // Non-JSON reply (for example, a proxy error page); fall back to the HTTP status.
  }
  if (!res.ok) {
    throw new Error(data.error ?? `TTN respondió ${data.ttnStatus ?? res.status}`);
  }
  return data;
}
