import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";

export default [
  { ignores: ["dist"] },
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
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react, //引入插件对象react
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": [
        "warn", //off,error
        { argsIgnorePattern: "^[A-Z_]", varsIgnorePattern: "^[A-Z_]" },
      ],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-param-reassign": [
        //防止函数内部参数进行重新复制或者修改的情况
        "warn", // warn警告, off关闭
        {
          props: true,
          ignorePropertyModificationsFor: ["ref"],
        },
      ],
    },
    //让插件自动识别react版本
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
