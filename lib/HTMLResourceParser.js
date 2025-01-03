import * as cheerio from "cheerio";

import HTTPResponseError from "./HTTPResponseError.js";

export default class HTMLResourceParser {
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
