import { View, Text } from "react-native";

export default function Hole({ shape }: { shape: Shape }) {
  return (
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 1000,
        borderWidth: 3,
        borderColor: "#666",
        borderStyle: "dashed",
        backgroundColor: "rgba(0,0,0,0.05)",
        position: "absolute",
        top: shape.holePos.y,
        left: shape.holePos.x,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 16, color: "#666", fontWeight: "bold" }}>
        {shape.country}
      </Text>
    </View>
  );
}
