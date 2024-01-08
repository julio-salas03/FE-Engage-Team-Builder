import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { resolve } from "path";

const root = resolve(__dirname);

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: [
      {
        find: "@components",
        replacement: resolve(root, "./src/components/"),
      },
      {
        find: "@lib",
        replacement: resolve(root, "./src/lib/"),
      },
      {
        find: "@types",
        replacement: resolve(root, "./src/types/"),
      },
      {
        find: "@scripts",
        replacement: resolve(root, "./src/scripts/"),
      },
      {
        find: "@src",
        replacement: resolve(root, "./src/"),
      },
    ],
  },
  base: "./",
});
