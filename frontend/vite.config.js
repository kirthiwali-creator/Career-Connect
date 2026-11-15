import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During development, any request starting with /api is forwarded
// to the Express backend running on port 5000.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
