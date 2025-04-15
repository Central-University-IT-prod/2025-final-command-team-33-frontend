import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
const router = TanStackRouterVite({
  target: "react",
  autoCodeSplitting: true,
  routesDirectory: "./src/app/routes",
});

export default defineConfig({
  plugins: [react(), router],
  resolve: {
    alias: {
      $: "/src",
    },
  },
  publicDir: "assets",
});
