#!/usr/bin/env node

const fs = require('node:fs');
const process = require('node:process');
const { Buffer } = require('node:buffer');

const cheerio = require('cheerio');
const fetch = require('node-fetch');
const TurndownService = require('turndown');

class HTTPResponseError extends Error {
  constructor(response) {
    const { status, statusText, url } = response;

    super(`HTTP Error Response: ${status} ${statusText} <${url}>`);

    this.response = response;
  }
}

class HTMLResourceParser {
  parsedResponse;
  response;
  url;

  constructor(url) {
    this.url = url;
  }

  async fetch() {
    const response = this.response = await fetch(this.url);

    if (response.ok) {
      this.parsedResponse = cheerio.load(await response.text());
    } else {
      throw new HTTPResponseError(response);
    }

    return this;
  }
}

class GalleryPageParser extends HTMLResourceParser {
  #itemSelector = '#primary .hds-gallery-items .hds-gallery-item-link';

  get imageDetailPageUrls() {
    return this
      .parsedResponse(this.#itemSelector)
      .toArray()
      .map(anchor => anchor.attribs.href)
      .filter(url => url);
  }
}

class ImageDetailPageParser extends HTMLResourceParser {
  #buttonSelector = 'article[id^="post-"] a.button-primary';

  get imageArticlePageUrl() {
    return this.parsedResponse(this.#buttonSelector).get(0).attribs.href;
  }
}

class ImageArticlePageParser extends HTMLResourceParser {
  #articleSelector = 'article.image-article[id^="post-"]';
  #authorSelector = `${this.#articleSelector} .article-meta-item .hds-meta-heading`;
  #contentSelector = `${this.#articleSelector} .entry-content`;
  #titleSelector = `${this.#articleSelector} .article-header h1`;

  get author() {
    return this.parsedResponse(this.#authorSelector).text();
  }

  get canonicalUrl() {
    return this.parsedResponse('link[rel="canonical"]').get(0).attribs.href;
  }

  get content() {
    const content = this.parsedResponse(this.#contentSelector);

    content.find('.hds-media').remove();

    return new TurndownService().turndown(content.html());
  }

  get date() {
    return new Date(this.parsedResponse('meta[property="og:updated_time"]').get(0).attribs.content);
  }

  get id() {
    return this.parsedResponse(this.#articleSelector).get(0).attribs.id.split('-')[1]
  }

  get imageAlt() {
    return this.parsedResponse('meta[property="og:image:alt"]').get(0).attribs.content;
  }

  get imageUrl() {
    return this.parsedResponse('meta[property="og:image"]').get(0).attribs.content;
  }

  get title() {
    return this.parsedResponse(this.#titleSelector).text();
  }
}

const processUrls = async (promises = []) => {
  const errors = [];

  const values =
    await (await Promise.allSettled(promises))
      .filter(({ reason, status, value }) => {
        if (status !== 'fulfilled') {
          errors.push(reason);
        }

        return status === 'fulfilled';
      })
      .map(({ value }) => value);

  return { errors, values };
};

(async () => {
  try {
    console.log('🐶 Fetching and parsing NASA Image of the Day gallery page for image detail URLs...');
    const { imageDetailPageUrls } = (await new GalleryPageParser('https://www.nasa.gov/image-of-the-day/').fetch());

    console.log('🐶 Fetching and parsing image detail pages for image article URLs...');
    const { errors: imageDetailPageParserErrors, values: imageDetailPageParsers } =
      await processUrls(
        imageDetailPageUrls
          .slice(0, 4)
          .map(async url => {
            return (await new ImageDetailPageParser(url).fetch());
          })
      );

    console.log('🐶 Fetching and parsing image article pages...');
    const { errors: imageArticlePageParserErrors, values: imageArticlePageParsers } =
      await processUrls(
        imageDetailPageParsers.map(async ({ imageArticlePageUrl }) => {
          return (await new ImageArticlePageParser(imageArticlePageUrl).fetch());
        })
      );

    for (parser of imageArticlePageParsers) {
      const {
        author,
        canonicalUrl,
        content,
        date,
        id,
        imageAlt,
        imageUrl,
        title
      } = parser;

      const outputFilePath = `./src/_posts/${date.toISOString().split('T')[0]}-${id}.md`;

      if (fs.existsSync(outputFilePath)) {
        console.log(`❗️ A post already exists at ${outputFilePath}! Skipping...`);
        continue;
      }

      const data = Buffer.from(`---json\n${JSON.stringify({ date, title, canonicalUrl, imageUrl, imageAlt, author }, null, 2)}\n---\n\n${content}\n`);

      console.log(`💾 Saving new post to ${outputFilePath}!`);
      fs.writeFileSync(outputFilePath, data);
    }

    const errors = [imageDetailPageParserErrors, imageArticlePageParserErrors].flat();

    if (errors.length) {
      throw new AggregateError(errors);
    }
  } catch (error) {
    console.log('❌ The following errors were encountered while processing:');

    if (error instanceof AggregateError) {
      console.error(error.errors);
    } else {
      console.error(error);
      process.exit(1);
    }
  }
})();
