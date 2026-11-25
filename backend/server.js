import express from "express";
const app = express();
app.use(express.json());

const { TTN_REGION = "nam1", TTN_APP_ID, TTN_API_KEY } = process.env;

const COMMANDS = {
  reboot: () => "ff10ff",
  setInterval: (secs) => {
    const b = Buffer.alloc(2);
    b.writeUInt16LE(secs);
    return "ff03" + b.toString("hex");
  },
};

app.post("/api/downlink", async (req, res) => {
  const { devId, command, value, confirmed = true } = req.body;
  if (!COMMANDS[command]) return res.status(400).json({ error: "Comando no permitido" });

  const hex = COMMANDS[command](value);
  const url = `https://${TTN_REGION}.cloud.thethings.network/api/v3/as/applications/${TTN_APP_ID}/devices/${devId}/down/push`;

  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${TTN_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      downlinks: [{
        f_port: 85,
        frm_payload: Buffer.from(hex, "hex").toString("base64"),
        priority: "NORMAL",
        confirmed,
      }],
    }),
  });
  res.status(r.ok ? 202 : 502).json({ queued: r.ok, hex });
});

app.listen(3000, () => console.log("Servidor escuchando en http://localhost:3000"));