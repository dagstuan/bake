// @ts-check

import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import pluginNext from "@next/eslint-plugin-next";
import reactCompiler from "eslint-plugin-react-compiler";

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.config({
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js", "*.mjs"],
        },
      },
    },
    rules: {
      "@typescript-eslint/restrict-template-expressions": "off",
    },
  }),
  {
    ...pluginReact.configs.flat?.recommended,
    languageOptions: {
      ...pluginReact.configs.flat?.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  {
    name: "react-compiler/recommended",
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  {
    ignores: ["dist/**", "sanity.types.ts"],
  },
];
