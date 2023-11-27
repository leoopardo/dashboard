import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import reactSvgPlugin from "vite-plugin-react-svg";
import { VitePluginRadar } from "vite-plugin-radar";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    reactSvgPlugin(),
    VitePluginRadar({
      // Google Analytics tag injection
      analytics: {
        id: "G-8SMH6KZCSE",
      },
    }),
  ],
  build: { chunkSizeWarningLimit: 3000 },
});
