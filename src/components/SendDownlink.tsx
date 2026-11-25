import { createElement, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { sendDownlink } from '@/services/downlinkApi';


export default function SendDownlink({ devId }: { devId: string }) {
  const [status, setStatus] = useState("");

  const send = async () => {
    setStatus("Enviando…");
    try {
      await sendDownlink(devId, "setInterval", 60);
      setStatus("En cola. Se entregará en el próximo uplink del sensor");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Sin conexión con el backend");
    }
  };

  return createElement(
    View,
    { style: { padding: 16 } },
    createElement(
      Pressable,
      { onPress: send, style: { backgroundColor: "#2563eb", padding: 12, borderRadius: 8 } },
      createElement(Text, { style: { color: "white", textAlign: "center" } }, "Enviar comando"),
    ),
    createElement(Text, { style: { marginTop: 8 } }, status),
  );
}