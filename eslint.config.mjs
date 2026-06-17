import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', '**/*.d.ts']),
  {
    rules: {
      'no-console': 'warn',

      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],

      'no-var': 'error',

      'prefer-const': 'error',

      'arrow-parens': ['error', 'always'],

      eqeqeq: 'error',

      'react/react-in-jsx-scope': 'off',

      'react/prop-types': 'off',

      '@typescript-eslint/no-empty-interface': 'warn',

      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],

      'react-hooks/set-state-in-effect': 'off',

      'react-hooks/incompatible-library': 'off',
    },
  },
]);

export default eslintConfig;
