import { Slot } from 'expo-router'; // Only if using Expo Router
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot /> {/* or your stack/navigation setup */}
    </GestureHandlerRootView>
  );
}