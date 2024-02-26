const { EleventyHtmlBasePlugin, EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
  // Front Matter Data
  eleventyConfig.setFrontMatterParsingOptions({ language: "json" });

  // Global Data
  eleventyConfig.addGlobalData("app", require("./src/manifest.webmanifest.json"));

  // Passthrough File Copy
  eleventyConfig
    .addPassthroughCopy("./src/assets")
    .addPassthroughCopy("./src/favicon.ico")
    .addPassthroughCopy({
      "./src/manifest.webmanifest.json": "manifest.webmanifest",
    });

  // Plugins
  eleventyConfig.addPlugin(require("@jgarber/eleventy-plugin-liquid"), {
    globals: {
      dates: {
        display: "%B %e<sup>%q</sup>, %Y",
        iso8601: "%Y-%m-%d",
      },
    },
  });

  eleventyConfig.addPlugin(require("@jgarber/eleventy-plugin-markdown"));
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  return {
    dir: {
      input: "./src",
    },
    pathPrefix: "/nasa-iotd/",
  };
};
