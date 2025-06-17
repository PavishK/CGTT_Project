import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
});

    //   visualizer({
    //   filename: 'visualizer_report.html',    
    //   open: true,                         
    //   gzipSize: true,                     
    //   brotliSize: true,                   
    // }),