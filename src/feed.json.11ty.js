module.exports = class {
  data() {
    return {
      eleventyExcludeFromCollections: true,
      permalink: '/feed.json'
    };
  }

  async render({ iotd, app, collections, permalink }) {
    const items = await Promise.all(
      collections
        .post
        .reverse()
        .slice(0, 30)
        .map(async post => {
          return {
            id: post.data.canonical_url,
            url: post.data.canonical_url,
            title: this.markdown(post.data.title, 'inline'),
            content_html: await this.renderFile('./src/_includes/post.liquid', post),
            image: post.data.image_url,
            date_published: post.date,
            authors: [
              {
                name: post.data.author
              }
            ]
          };
        })
    );

    return JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: app.name,
      home_page_url: iotd.url,
      feed_url: this.htmlBaseUrl(permalink, app.start_url),
      description: app.description,
      icon: this.htmlBaseUrl(app.icons[1].src, app.start_url),
      favicon: this.htmlBaseUrl(app.icons[0].src, app.start_url),
      authors: iotd.authors,
      language: app.lang,
      items: items
    });
  }
};
