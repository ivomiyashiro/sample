import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**', 'coverage/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Node.js builtins
            ['^node:'],
            // Express
            ['^express'],
            // NestJS packages
            ['^@nestjs'],
            // Other external packages
            ['^[^@/]'],
            // Shared packages
            ['^@sample/'],
            // Internal direct children (@/utils, @/config, @/common, etc.)
            ['^@/[^/]+$'],
            // Internal nested paths (@/common/services, @/modules/auth/utils, etc.)
            ['^@/.*/.+'],
            // Parent imports
            ['^\\.\\.'],
            // Sibling imports
            ['^\\./'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
);
