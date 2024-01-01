import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { resolve } from "path";

const root = resolve(__dirname);

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "@components": resolve(root, "components"),
      "@types": resolve(root, "types"),
      "@utils": resolve(root, "utils"),
    },
  },
});
