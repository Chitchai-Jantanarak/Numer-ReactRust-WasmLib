import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
    
  build: {
    // wasm supporter 
    target: 'esnext',
    sourcemap: true, 
  },
  optimizeDeps: {
    // Prevent pre-bundling pkg
    exclude: ['./src/pkg/cal_core.js'], 
  },
  resolve: {
    alias: {
      // resolve import
      '@cal_core': '/src/pkg/cal_core.js',
    },
  },
});
