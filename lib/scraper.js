import fs from "node:fs";
import process from "node:process";

import GalleryPageParser from "./GalleryPageParser.js";
import ImageArticlePageParser from "./ImageArticlePageParser.js";

const processUrls = async (promises = []) => {
  const settledPromises = await Promise.allSettled(promises);

  const errors = [];

  const values =
    settledPromises
      .filter(({ reason, status }) => {
        if (status !== "fulfilled") {
          errors.push(reason);
        }

        return status === "fulfilled";
      })
      .map(({ value }) => value);

  return { errors, values };
};

(async () => {
  try {
    console.log("🐶 Fetching and parsing NASA Image of the Day gallery page for image detail URLs...");
    const { imageArticlePageUrls } = (await new GalleryPageParser("https://www.nasa.gov/image-of-the-day/").fetch());

    console.log("🐶 Fetching and parsing image article pages...");
    const { errors, values: parsers } =
      await processUrls(
        imageArticlePageUrls
          .slice(0, 4)
          .map(async (url) => {
            return (await new ImageArticlePageParser(url).fetch());
          }),
      );

    for (const parser of parsers) {
      const {
        author,
        canonicalUrl,
        content,
        date,
        id,
        imageAlt,
        imageUrl,
        title,
      } = parser;

      const outputFilePath = `./src/_posts/${date.toISOString().split("T")[0]}-${id}.md`;

      if (fs.existsSync(outputFilePath)) {
        console.log(`❗️ A post already exists at ${outputFilePath}! Skipping...`);
        continue;
      }

      /* eslint-disable-next-line sort-keys */
      const data = `---\n${JSON.stringify({ date, title, canonicalUrl, imageUrl, imageAlt, author }, null, 2)}\n---\n\n${content}\n`;

      console.log(`💾 Saving new post to ${outputFilePath}!`);
      fs.writeFileSync(outputFilePath, data);
    }

    if (errors.length > 0) {
      throw new AggregateError(errors, "❌ The following errors were encountered while processing:");
    }
  } catch (error) {
    if (error instanceof AggregateError) {
      console.log(error.message);
      console.log(error.errors);
    } else {
      console.log(error);
      process.exitCode = 1;
    }
  }
})();
