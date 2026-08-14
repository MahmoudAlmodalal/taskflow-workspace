// Quiet Command Center: use the repository path only when the build runs in GitHub Actions.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/taskflow-workspace/" : "/",
  plugins: [react()],
});
