import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

export default function Index() {
  return (
    <WithSkiaWeb
      // import() uses the default export of MySkiaComponent.tsx
      getComponent={() => import("@/components/main")}
      fallback={<Text>Loading Skia...</Text>}
    />
  );
}
