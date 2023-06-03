const markdown = require('markdown-it');

module.exports = (() => {
  const options = {
    breaks: true,
    typographer: true
  };

  return markdown(options);
})();
