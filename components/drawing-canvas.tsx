import { Text, View, Pressable, StyleSheet } from "react-native";
import React, { useReducer } from "react";
import { Canvas, useCanvasSize, Rect } from "@shopify/react-native-skia";
import { SafeAreaView } from "react-native-safe-area-context";
// Notice the import path `@shopify/react-native-skia/lib/module/web`
// This is important only to pull the code responsible for loading Skia.
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

type ToolState = {
  color: string;
};

type ToolAction = {
  type: "set_color";
  color: string;
};

function toolReducer(state: ToolState, action: ToolAction) {
  switch (action.type) {
    case "set_color":
      return { ...state, color: action.color };
    default:
      return state;
  }
}
export default function Main() {
  const {
    ref,
    size: { width, height },
  } = useCanvasSize();
  const [paintbrush, updatePaintbrush] = useReducer(toolReducer, {
    color: "red",
  });
  return (
    <View>
      <Canvas ref={ref} style={{ flex: 1 }}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          color={paintbrush.color}
        />
      </Canvas>
      <Paint color={paintbrush.color} />
      <Palette colors={["red", "green", "blue"]} dispatch={updatePaintbrush} />
    </View>
  );
}

type PaletteProps = {
  colors: string[];
  dispatch: React.Dispatch<ToolAction>;
};

export function Palette({ colors, dispatch }: PaletteProps) {
  return (
    <View>
      {colors.map((color, i) => {
        return (
          <Pressable
            key={`paleette-${color}-${i}`}
            onPress={() => dispatch({ type: "set_color", color })}
          >
            <Paint color={color} />
          </Pressable>
        );
      })}
    </View>
  );
}

type PaintProps = {
  color: string;
};

export function Paint({ color }: PaintProps) {
  return (
    <View
      style={{
        width: 50,
        height: 50,
        backgroundColor: color,
      }}
    />
  );
}
