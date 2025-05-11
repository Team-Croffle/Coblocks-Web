/* eslint-disable no-undef */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@data': path.resolve(__dirname, './src/data'),
      '@fonts': path.resolve(__dirname, './src/assets/fonts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@images': path.resolve(__dirname, './src/assets/images'),
      '@langs': path.resolve(__dirname, './src/langs'),
      '@layouts': path.resolve(__dirname, './src/components/layouts'),
      '@modules': path.resolve(__dirname, './src/components/modules'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/assets/styles'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
