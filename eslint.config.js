import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'semi': ['warn', 'always'],
      'comma-dangle': ['warn', 'always-multiline'],
      'react/jsx-max-props-per-line': ['warn', { maximum: 1 }],
      'react/jsx-first-prop-new-line': ['warn', 'multiline-multiprop'],
      'react/react-in-jsx-scope': ['off'],
      'react-refresh/only-export-components': 'off'
    },
  },
])
