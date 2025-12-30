import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Performance optimization
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Core React libraries
          "react-vendor": ["react", "react-dom", "react-router-dom"],

          // Redux state management
          "redux-vendor": ["@reduxjs/toolkit", "react-redux"],

          // React Query for server state
          "query-vendor": ["@tanstack/react-query"],

          // UI and utilities
          "ui-vendor": ["lucide-react"],

          // Authentication and API
          "api-vendor": ["axios", "js-cookie", "jwt-decode"],
        },
      },
    },

    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,

    // Enable source maps for production debugging
    sourcemap: false,

    // Minification (use esbuild for better performance)
    minify: "esbuild",
  }, // Optimization for development
  server: {
    port: 3000,
    open: true,
  },

  // Preview server configuration
  preview: {
    port: 3000,
  },
});
