const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function sendDownlink(
  devId: string,
  command: "reboot" | "setInterval",
  value?: number,
) {
  const res = await fetch(`${API_URL}/api/downlink`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ devId, command, value }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`TTN respondió ${data.ttnStatus ?? res.status}`);
  return data;
}