import HTMLResourceParser from "./HTMLResourceParser.js";

export default class GalleryPageParser extends HTMLResourceParser {
  #itemSelector = "#primary .hds-gallery-items .hds-gallery-item-link";

  get imageArticlePageUrls() {
    return this
      .parsedResponse(this.#itemSelector)
      .toArray()
      .map(anchor => anchor.attribs.href);
  }
}
