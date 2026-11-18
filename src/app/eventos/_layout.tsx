import { Stack } from 'expo-router';

export default function TrailEventLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="ubicar" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
