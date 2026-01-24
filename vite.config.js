import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/dropship-apps/" : "/",

  plugins: [
    vue(),
    tailwindcss()
  ],

  server: {
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    }
  }
}));
