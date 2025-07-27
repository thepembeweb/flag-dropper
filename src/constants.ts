import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const SHAPE_SIZE = 60;
export const MIN_DISTANCE = 80;
export const HEADER_HEIGHT = 100;

export const countries = [
  { flag: "🇺🇸", country: "USA" },
  { flag: "🇫🇷", country: "France" },
  { flag: "🇩🇪", country: "Germany" },
  { flag: "🇯🇵", country: "Japan" },
  { flag: "🇮🇹", country: "Italy" },
];
