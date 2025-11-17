import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  LayoutChangeEvent,
  TouchableOpacity,
  Text,
} from "react-native";
import { Canvas, Path, Skia, PaintStyle } from "@shopify/react-native-skia";

import { useSharedValue as useValue } from "react-native-reanimated";
type Point = { x: number; y: number };

type Stroke = {
  path: any; // SkPath
  color: string;
  width: number;
};

const COLORS = ["#000000", "#ff4757", "#3742fa", "#2ed573"];
const WIDTHS = [4, 8, 12];

export const DrawingCanvas: React.FC = () => {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [selectedWidth, setSelectedWidth] = useState<number>(4);

  const [size, setSize] = useState({ width: 0, height: 0 });

  // path que se está dibujando en este momento
  const currentPath = useValue<any | null>(null);
  const currentStrokeMeta = useMemo(
    () => ({ color: selectedColor, width: selectedWidth }),
    [selectedColor, selectedWidth],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const touchHandler = useTouchHandler({
    onStart: (touch) => {
      const { x, y } = touch;
      const path = Skia.Path.Make();
      path.moveTo(x, y);
      currentPath.current = path;
    },
    onActive: (touch) => {
      if (!currentPath.current) return;
      const { x, y } = touch;
      currentPath.current.lineTo(x, y);
    },
    onEnd: () => {
      if (!currentPath.current) return;
      const finishedPath = currentPath.current;
      setStrokes((prev) => [
        ...prev,
        {
          path: finishedPath,
          color: currentStrokeMeta.color,
          width: currentStrokeMeta.width,
        },
      ]);
      currentPath.current = null;
    },
  });

  const handleClear = () => {
    setStrokes([]);
    currentPath.current = null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        {/* Colores */}
        <View style={styles.colorRow}>
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorButton,
                {
                  backgroundColor: c,
                  borderWidth: selectedColor === c ? 2 : 0,
                },
              ]}
              onPress={() => setSelectedColor(c)}
            />
          ))}
        </View>

        {/* Grosores */}
        <View style={styles.widthRow}>
          {WIDTHS.map((w) => (
            <TouchableOpacity
              key={w}
              style={[
                styles.widthButton,
                { borderWidth: selectedWidth === w ? 2 : 1 },
              ]}
              onPress={() => setSelectedWidth(w)}
            >
              <View
                style={{
                  width: w,
                  height: w,
                  borderRadius: w / 2,
                  backgroundColor: "#000",
                }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Borrar */}
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.canvasContainer} onLayout={onLayout}>
        {size.width > 0 && size.height > 0 && (
          <Canvas
            style={{ width: size.width, height: size.height }}
            onTouch={touchHandler}
          >
            {/* Trazos ya dibujados */}
            {strokes.map((stroke, idx) => (
              <Path
                key={idx}
                path={stroke.path}
                color={stroke.color}
                style="stroke"
                strokeWidth={stroke.width}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}
            {/* Trazo actual */}
            {currentPath.current && (
              <Path
                path={currentPath.current}
                color={currentStrokeMeta.color}
                style="stroke"
                strokeWidth={currentStrokeMeta.width}
                strokeCap="round"
                strokeJoin="round"
              />
            )}
          </Canvas>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  toolbar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fafafa",
  },
  colorRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  colorButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    borderColor: "#333",
  },
  widthRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  widthButton: {
    padding: 6,
    marginRight: 8,
    borderRadius: 16,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  clearButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#ff7675",
  },
  clearText: {
    color: "#fff",
    fontWeight: "600",
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

