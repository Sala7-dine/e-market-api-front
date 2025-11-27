import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  { ignores: ["dist", "build", "node_modules", "**/__mocks__/**"] },
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js", "**/*.spec.js", "**/__mocks__/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        fail: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...prettierConfig.rules,

      // Airbnb-style rules
      "no-console": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "quote-props": ["error", "as-needed"],
      "prefer-template": "error",
      "prefer-arrow-callback": "error",
      "arrow-body-style": ["error", "as-needed"],
      "no-param-reassign": ["error", { props: false }],
      "prefer-destructuring": ["error", { object: true, array: false }],

      // React specific
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-filename-extension": ["warn", { extensions: [".jsx", ".js"] }],
      "react/function-component-definition": "off",
      "react/jsx-props-no-spreading": "off",
      "react/require-default-props": "off",
      "react/no-unescaped-entities": "off",

      // Import rules
      "import/prefer-default-export": "off",
      "import/no-unresolved": "off",
      "import/extensions": "off",

      // Accessibility - disabled for development
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",

      // Prettier integration
      "prettier/prettier": "error",

      // React Refresh
      "react-refresh/only-export-components": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];
