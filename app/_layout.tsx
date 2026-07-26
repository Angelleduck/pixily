// import { BottomSheetModalProvider } from "@expo/ui/community/bottom-sheet";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
