const globals = require('globals');

const config = require('@jgarber/eslint-config');

module.exports = [
  ...config,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin
      }
    }
  }
];
