import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GameBoard from "./src/components/GameBoard";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameBoard />

      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
