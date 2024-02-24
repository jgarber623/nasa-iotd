module.exports = (async () => {
  const { default: config } = await import("@jgarber/eslint-config");

  return [
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
})();
