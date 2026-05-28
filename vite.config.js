import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuracion principal de Vite para compilar y servir la aplicacion React.
// El plugin de React habilita JSX, recarga rapida durante desarrollo y optimizaciones de build.
export default defineConfig({
  plugins: [react()],
})
