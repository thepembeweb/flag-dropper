import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";
import Hole from "./Hole";
import Shape from "./Shape";
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  SHAPE_SIZE,
  MIN_DISTANCE,
  HEADER_HEIGHT,
  countries,
} from "../constants";

const getRandomPoint = (
  existingPoints: { x: number; y: number }[] = [],
  isForShape: boolean = false
) => {
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const point = {
      x: Math.random() * (SCREEN_WIDTH - SHAPE_SIZE - 40) + 20,
      y:
        Math.random() * (SCREEN_HEIGHT - SHAPE_SIZE - HEADER_HEIGHT - 250) +
        HEADER_HEIGHT +
        0,
    };

    const minDistance = isForShape ? MIN_DISTANCE + 20 : MIN_DISTANCE;

    const isFarEnough = existingPoints.every((existingPoint) => {
      const distance = Math.sqrt(
        Math.pow(point.x - existingPoint.x, 2) +
          Math.pow(point.y - existingPoint.y, 2)
      );
      return distance >= minDistance;
    });

    if (isFarEnough) {
      return point;
    }

    attempts++;
  }

  const gridSize = Math.ceil(Math.sqrt(existingPoints.length + 1));
  const baseSpacing = isForShape ? 120 : 100;
  const gridX =
    (existingPoints.length % gridSize) * (SCREEN_WIDTH / gridSize) +
    SHAPE_SIZE / 2;
  const gridY =
    Math.floor(existingPoints.length / gridSize) * baseSpacing +
    HEADER_HEIGHT +
    50;

  return { x: gridX, y: gridY };
};

const generateShapes = (): Shape[] => {
  const shapes: Shape[] = [];
  const holePositions: { x: number; y: number }[] = [];
  const shapePositions: { x: number; y: number }[] = [];

  countries.forEach((country, index) => {
    const holePos = getRandomPoint(holePositions, false);
    holePositions.push(holePos);

    const allUsedPositions = [...holePositions, ...shapePositions];
    const startPos = getRandomPoint(allUsedPositions, true);
    shapePositions.push(startPos);

    shapes.push({
      flag: country.flag,
      country: country.country,
      holePos,
      startPos,
    });
  });

  return shapes;
};

const shapes: Shape[] = generateShapes();

export default function GameBoard() {
  const [completedFlags, setCompletedFlags] = useState<Set<string>>(new Set());
  const [gameCompleted, setGameCompleted] = useState(false);
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    if (completedFlags.size === countries.length && !gameCompleted) {
      setGameCompleted(true);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setTimeout(() => {
        confettiRef.current?.start();
      }, 300);
    }
  }, [completedFlags, gameCompleted]);

  const handleFlagComplete = (country: string) => {
    setCompletedFlags((prev) => new Set([...prev, country]));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTextContainer}>
        {!gameCompleted && (
          <Text style={styles.title}>
            Drag and drop the flags to their matching countries!
          </Text>
        )}
        {gameCompleted && (
          <Text style={styles.successMessage}>
            Congratulations! All flags matched! 🎉
          </Text>
        )}
      </View>

      <View style={styles.gameArea}>
        {shapes.map((shape) => (
          <Hole shape={shape} key={shape.country} />
        ))}
        {shapes.map((shape) => (
          <Shape
            shape={shape}
            key={shape.country}
            onComplete={handleFlagComplete}
            isCompleted={completedFlags.has(shape.country)}
          />
        ))}
      </View>

      {gameCompleted && (
        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: SCREEN_WIDTH / 2, y: 0 }}
          autoStart={false}
          colors={[
            "#ff0000",
            "#00ff00",
            "#0000ff",
            "#ffff00",
            "#ff00ff",
            "#00ffff",
          ]}
          explosionSpeed={350}
          fallSpeed={2500}
          fadeOut={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "antiquewhite",
  },
  headerTextContainer: {
    height: HEADER_HEIGHT,
    backgroundColor: "antiquewhite",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    zIndex: 1000,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(160, 82, 45, 0.2)",
  },
  gameArea: {
    flex: 1,
    position: "relative",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "sienna",
  },
  successMessage: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "green",
    backgroundColor: "rgba(0, 255, 0, 0.1)",
  },
});
