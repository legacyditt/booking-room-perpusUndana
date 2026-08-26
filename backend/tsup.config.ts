import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts"],
  format: ["cjs"],
  outDir: "dist",
  platform: "node",
  dts: false,
  clean: true,
});
