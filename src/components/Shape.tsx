import Animated, {
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Text } from "react-native";
import * as Haptics from "expo-haptics";

function getDistance(point1: Point, point2: Point) {
  "worklet";
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

interface ShapeProps {
  shape: Shape;
  onComplete?: (country: string) => void;
  isCompleted?: boolean;
}

export default function Shape({
  shape,
  onComplete,
  isCompleted = false,
}: ShapeProps) {
  const x = useSharedValue(shape.startPos.x);
  const y = useSharedValue(shape.startPos.y);

  const triggerSuccessHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const triggerFailureHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const gesture = Gesture.Pan()
    .enabled(!isCompleted)
    .onChange((e) => {
      x.value += e.changeX;
      y.value += e.changeY;
    })
    .onEnd(() => {
      const distance = getDistance({ x: x.value, y: y.value }, shape.holePos);
      if (distance < 30) {
        x.value = withSpring(shape.holePos.x);
        y.value = withSpring(shape.holePos.y);

        runOnJS(triggerSuccessHaptic)();

        if (onComplete && !isCompleted) {
          runOnJS(onComplete)(shape.country);
        }
      } else {
        x.value = withSpring(shape.startPos.x);
        y.value = withSpring(shape.startPos.y);

        runOnJS(triggerFailureHaptic)();
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={{
          width: 60,
          height: 60,
          borderRadius: 1000,
          backgroundColor: isCompleted ? "#e8f5e8" : "white",
          borderWidth: 2,
          borderColor: isCompleted ? "#4CAF50" : "#ccc",
          position: "absolute",
          top: y,
          left: x,
          justifyContent: "center",
          alignItems: "center",
          elevation: 3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isCompleted ? 0.1 : 0.25,
          shadowRadius: 3.84,
          opacity: isCompleted ? 0.8 : 1,
        }}
      >
        <Text style={{ fontSize: 32 }}>{shape.flag}</Text>
      </Animated.View>
    </GestureDetector>
  );
}
