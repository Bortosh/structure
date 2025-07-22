import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/maps-proxy': {
          target: 'https://maps.googleapis.com',
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/api\/maps-proxy/, '/maps/api/place/textsearch/json'),
        },
      },
    },
    define: {
      'process.env': {
        VITE_GOOGLE_MAPS_API_KEY: JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
      },
    },
  };
});
