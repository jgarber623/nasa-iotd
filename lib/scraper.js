#!/usr/bin/env node

const fs = require('node:fs');
const process = require('node:process');
const { Buffer } = require('node:buffer');

const fetch = require('node-fetch');
const TurndownService = require('turndown');

class HTTPResponseError extends Error {
  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);

    this.response = response;
  }
}

const base_url = 'https://www.nasa.gov';

const search_params = new URLSearchParams({
  from: 0,
  size: 5,
  sort: 'promo-date-time:desc',
  q: '((ubernode-type:feature OR ubernode-type:image) AND (routes:1446))'
});

const search_url = `${base_url}/api/2/ubernode/_search?${search_params}`;

(async () => {
  console.log('🐶 Fetching and parsing data from NASA Search API...');

  const { hits: { hits: [...results] } } = await (async () => {
    const response = await fetch(search_url);

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

      const canonical_url = new URL(result.uri, base_url);
      const image_url = new URL(image.uri.replace('public:/', '/sites/default/files'), base_url);
      const image_alt = image.alt;

      const content =
        new TurndownService().turndown(
          result
            .body
            .toString()
            .replace(/\n/g, '')
            .replace(/\s+/g, ' ')
            .trim()
        );

      data = new Buffer.from(`---json\n${JSON.stringify({ date, title, canonical_url, image_url, image_alt, author }, null, 2)}\n---\n\n${content}\n`);

      console.log(`💾 Saving new post to ${outputFilePath}!`);
      fs.writeFileSync(outputFilePath, data);
    });
})();
