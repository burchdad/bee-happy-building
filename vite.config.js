import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        barndominiums: resolve(__dirname, "barndominiums/index.html"),
        commercial: resolve(__dirname, "commercial-buildings/index.html"),
        shopsGarages: resolve(__dirname, "shops-garages/index.html"),
        gallery: resolve(__dirname, "gallery/index.html"),
        process: resolve(__dirname, "build-process/index.html"),
        about: resolve(__dirname, "about/index.html"),
        faq: resolve(__dirname, "faq/index.html"),
        contact: resolve(__dirname, "contact/index.html"),
        financing: resolve(__dirname, "financing/index.html"),
        resources: resolve(__dirname, "resources/index.html")
      }
    }
  }
});
