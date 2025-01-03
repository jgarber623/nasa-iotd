import TurndownService from "turndown";

import HTMLResourceParser from "./HTMLResourceParser.js";

export default class ImageArticlePageParser extends HTMLResourceParser {
  #articleSelector = `article.image-article[id^="post-"]`;
  #authorSelector = `${this.#articleSelector} .article-meta-item .hds-meta-heading`;
  #contentSelector = `${this.#articleSelector} .entry-content`;
  #titleSelector = `${this.#articleSelector} .article-header h1`;

  get author() {
    return this.parsedResponse(this.#authorSelector).text();
  }

  get canonicalUrl() {
    return this.parsedResponse(`link[rel="canonical"]`).attr("href");
  }

  get content() {
    const content = this.parsedResponse(this.#contentSelector);

    content.find(".hds-media").remove();

    return new TurndownService().turndown(content.html());
  }

  get date() {
    return new Date(this.parsedResponse(`meta[property="og:updated_time"]`).attr("content"));
  }

  get id() {
    return this.parsedResponse(this.#articleSelector).attr("id").split("-")[1];
  }

  get imageAlt() {
    return this.parsedResponse(`meta[property="og:image:alt"]`).attr("content");
  }

  get imageUrl() {
    return this.parsedResponse(`meta[property="og:image"]`).attr("content");
  }

  get title() {
    return this.parsedResponse(this.#titleSelector).text();
  }
}
