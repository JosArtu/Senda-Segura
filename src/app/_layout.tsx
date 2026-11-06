import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { DemoSessionProvider } from '@/hooks/useDemoSession';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DemoSessionProvider>
        <StatusBar style="dark" />
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#E7EBE3' }}>
          <View style={{ flex: 1, width: '100%', maxWidth: 640, backgroundColor: colors.cream }}>
            <RootNavigator />
          </View>
        </View>
      </DemoSessionProvider>
    </SafeAreaProvider>
  );
}
