import js from "@eslint/js";

export default [
  // Skip vendored files entirely
  {
    ignores: ["src/vendor/**"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        // Browser / DOM
        console: "readonly",
        document: "readonly",
        window: "readonly",
        customElements: "readonly",
        navigator: "readonly",
        Promise: "readonly",
        URL: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Element: "readonly",
        HTMLElement: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        fetch: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        queueMicrotask: "readonly",
        ResizeObserver: "readonly",
        MutationObserver: "readonly",
        // LitElement / HA
        LitElement: "readonly",
        html: "readonly",
        css: "readonly",
        ha: "readonly",
        HomeAssistant: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      "no-undef": "error",
    },
  },
];
