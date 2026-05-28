import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// Configuracion de ESLint utilizada para revisar archivos JavaScript y JSX del proyecto.
// Se combinan reglas recomendadas de JavaScript, reglas de Hooks y soporte para React Refresh.
export default defineConfig([
  // La carpeta dist es generada por Vite durante el build y no debe analizarse.
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      // El proyecto se ejecuta en navegador, por eso se habilitan las variables globales del browser.
      globals: globals.browser,
      // Permite que ESLint interprete correctamente la sintaxis JSX usada por React.
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
