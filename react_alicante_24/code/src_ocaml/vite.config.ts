import { nodeResolve } from "@rollup/plugin-node-resolve";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodeResolve(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
