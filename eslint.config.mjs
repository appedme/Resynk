import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),{
    rules: {
      "no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off",

      "react/no-unescaped-entities": "off",
      "react/jsx-uses-vars": "warn",
    },
  },
];

export default eslintConfig;
