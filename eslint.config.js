const config = require('@jgarber/eslint-config');

module.exports = [
  ...config,
  {
    files: ['lib/**/*.js'],
    languageOptions: {
      globals: {
        fetch: 'readonly'
      }
    }
  }
];
