import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: './' fa que els assets es carreguin amb rutes relatives,
// així funciona tant en https://usuari.github.io/hip-cultura/
// com en un domini propi, sense haver de tocar res més.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
