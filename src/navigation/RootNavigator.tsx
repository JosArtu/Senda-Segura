import { Stack } from 'expo-router';

export function RootNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="setup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="trail/[id]" />
      <Stack.Screen name="sos" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
