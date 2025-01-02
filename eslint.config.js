import config from "@jgarber/eslint-config";

export default [
  { ignores: ["_site"] },
  ...config,
  {
    files: ["lib/**/*.js"],
    languageOptions: {
      globals: {
        fetch: "readonly",
      },
    },
  },
];
