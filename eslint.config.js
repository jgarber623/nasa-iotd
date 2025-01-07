import config from "@jgarber/eslint-config";

export default [
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
