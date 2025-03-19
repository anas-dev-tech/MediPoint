import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"; // Import the 'path' module

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4173,
    host: "0.0.0.0",
  },
  base: '/d/', // Set the base path for assets

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Use the 'path' module here
    },
  },
});