import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { NodePackageImporter } from 'sass-embedded'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(env => ({
  css: {
    modules: {
      generateScopedName: env.command == 'build' ? '[hash:base64:5]' : '',
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/vars" as *;\r\n',
        importers: [new NodePackageImporter()],
      }
    },
  },
  resolve: { alias: { '@': resolve(__dirname, './src') } },
  build: { rollupOptions: {
    input: [
      '@a4smanjorg5/invoida-components/App',
      '@a4smanjorg5/invoida-components/Loading',
    ],
    output: { manualChunks(id) {
      if (id.includes('node_modules')) {
        return id.match(/node_modules\/([^\/])/)?.[1]
      }
    } }
  } },
  plugins: [react()],
}))
