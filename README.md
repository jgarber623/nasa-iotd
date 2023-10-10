# nasa-iotd

[![Build](https://img.shields.io/github/actions/workflow/status/jgarber623/nasa-iotd/build.yml?branch=main&logo=github&style=for-the-badge)](https://github.com/jgarber623/nasa-iotd/actions/workflows/build.yml)
[![Scrape](https://img.shields.io/github/actions/workflow/status/jgarber623/nasa-iotd/scrape.yml?branch=main&label=Scrape&logo=github&style=for-the-badge)](https://github.com/jgarber623/nasa-iotd/actions/workflows/scrape.yml)

Providing a feed of content from NASA's [Image of the Day](https://www.nasa.gov/image-of-the-day/) (IotD) website.

I _love_ the IotD website, but it doesn't provide any subscribable feed (as far as I could find).

This project uses clunky HTML scraping to generate to generate a feed of posts for consumption in your feed reader of choice. Built daily with [Eleventy](https://www.11ty.dev) and [GitHub Actions](https://docs.github.com/en/actions).

## Usage

Add any of the following URLs to your preferred feed reader:

- [Atom v1.0](https://jgarber623.github.io/nasa-iotd/feed.atom)
- [JSON Feed v1.1](https://jgarber623.github.io/nasa-iotd/feed.json)

## License

The source code for this project is dedicated to the public domain per the [Creative Commons CC0 1.0 Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/).

The content of the Markdown (`*.md`) files in the `./src/_posts` folder was parsed from NASA's [Image of the Day](https://www.nasa.gov/image-of-the-day/) website. Content authors are appropriately attributed in each feed item. Image credit information (when available) is displayed alongside each post's content.

NASA's "Meatball" logo graphic was downloaded from the [Symbols of NASA](https://www.nasa.gov/audience/forstudents/5-8/features/symbols-of-nasa.html) website. Permission was not obtained in accordance with NASA's [Media Usage Guidelines](https://www.nasa.gov/multimedia/guidelines/index.html).
