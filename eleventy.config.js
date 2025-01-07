import { readFileSync } from "node:fs";

import { EleventyHtmlBasePlugin, EleventyRenderPlugin } from "@11ty/eleventy";

import eleventyPluginLiquid from "@jgarber/eleventy-plugin-liquid";
import eleventyPluginMarkdown from "@jgarber/eleventy-plugin-markdown";

export default function(eleventyConfig) {
  // Front Matter Data
  eleventyConfig.setFrontMatterParsingOptions({ language: "json" });

  // Global Data
  eleventyConfig.addGlobalData("app", JSON.parse(readFileSync("./src/manifest.webmanifest")));

  // Passthrough File Copy
  eleventyConfig
    .addPassthroughCopy("./src/assets")
    .addPassthroughCopy("./src/*.{ico,webmanifest}");

  // Plugins
  eleventyConfig.addPlugin(eleventyPluginLiquid, {
    globals: {
      dates: {
        display: "%B %e<sup>%q</sup>, %Y",
        iso8601: "%Y-%m-%d",
      },
    },
  });

  eleventyConfig.addPlugin(eleventyPluginMarkdown);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
}

export const config = {
  dir: {
    input: "./src",
  },
  pathPrefix: "/nasa-iotd/",
};
