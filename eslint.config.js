// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  // Ignorar carpetas de build/coverage, etc.
  { ignores: ['dist', 'build', 'coverage', 'node_modules'] },

  // Reglas para el código fuente TypeScript
  {
    name: 'app:src',
    files: ['src/**/*.ts', 'index.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    extends: [
      js.configs.recommended,          // Reglas base de ESLint
      ...tseslint.configs.recommended  // Reglas TS (sin type-check)
    ],
    rules: {
      // Estilo "standard-like" sin plugins extra
      semi: ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'never'],

      // TS útiles y poco ruidosas
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'indent': ['error', 2],                 // 2 espacios
      'space-before-function-paren': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-spacing': ['error', { before: true, after: true }]

    }
  },

  // Tests (Vitest + Supertest)
  {
    name: 'app:tests',
    files: ['test/**/*.ts', 'tests/**/*.ts', '**/*.{test,spec}.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.vitest      // describe, it, expect, vi, etc.
      }
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended
    ],
    rules: {
      // En tests solemos permitir any y console
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  },

  // Archivos de configuración JS (si tuvieras scripts sueltos .js)
  {
    name: 'app:config-js',
    files: ['*.config.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    extends: [js.configs.recommended],
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'never']
    }
  }
)
