import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/dropship-apps/", // 👈 MUST match GitHub repo name
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "icons/icon-192.png",
        "icons/icon-512.png"
      ],
      manifest: {
        name: "Dropship Manager",
        short_name: "Dropship",
        description: "Order & inventory management app",
        theme_color: "#0f172a",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/dropship-apps/",
        icons: [
          {
            src: "/dropship-apps/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/dropship-apps/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});
