import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    ignores: [
      'src/vendor/**',
      'src/sims2-panel-card.js',
      'src/sims2-plumbob-card.js',
    ],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        document: 'readonly',
        window: 'readonly',
        customElements: 'readonly',
        navigator: 'readonly',
        Promise: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        Element: 'readonly',
        HTMLElement: 'readonly',
        LitElement: 'readonly',
        html: 'readonly',
        css: 'readonly',
        Event: 'readonly',
      },
    },
    rules: {
      indent: 'off',
      quotes: 'off',
      semi: 'off',
      'no-unused-vars': 'off',
      'no-console': 'off',
      'no-undef': 'off',
    },
  },
];