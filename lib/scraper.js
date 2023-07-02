#!/usr/bin/env node

const fs = require('node:fs');
const { Buffer } = require('node:buffer');

const fetch = require('node-fetch');
const TurndownService = require('turndown');

class HTTPResponseError extends Error {
  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);

    this.response = response;
  }
}

const baseUrl = 'https://www.nasa.gov';

const searchParams = new URLSearchParams({
  from: 0,
  size: 5,
  sort: 'promo-date-time:desc',
  q: '((ubernode-type:feature OR ubernode-type:image) AND (routes:1446))'
});

const searchUrl = `${baseUrl}/api/2/ubernode/_search?${searchParams}`;

(async () => {
  console.log('🐶 Fetching and parsing data from NASA Search API...');

  const { hits: { hits: [...results] } } = await (async () => {
    const response = await fetch(searchUrl);

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPResponseError(response);
    }
  })();

  results
    .map(result => result._source)
    .forEach(result => {
      const {
        'cardfeed-title': title,
        'master-image': image,
        name: author,
        nid: id,
        'promo-date-time': date
      } = result;

      const outputFilePath = `./src/_posts/${date.split('T')[0]}-${id}.md`;

      if (fs.existsSync(outputFilePath)) {
        console.log(`❗️ A post already exists at ${outputFilePath}! Skipping...`);
        return;
      }

      const canonicalUrl = new URL(result.uri, baseUrl);
      const imageUrl = new URL(image.uri.replace('public:/', '/sites/default/files'), baseUrl);
      const imageAlt = image.alt;

      const content = new TurndownService().turndown(result.body.toString());

      const data = Buffer.from(`---json\n${JSON.stringify({ date, title, canonicalUrl, imageUrl, imageAlt, author }, null, 2)}\n---\n\n${content}\n`);

      console.log(`💾 Saving new post to ${outputFilePath}!`);
      fs.writeFileSync(outputFilePath, data);
    });
})();
