# nasa-iotd

Providing a feed of content from NASA's [Image of the Day](https://www.nasa.gov/multimedia/imagegallery/iotd.html) (IotD) website.

I _love_ the IotD website, but it doesn't provide any subscribable feed (as far as I could find).

This project uses an undocumented (but publicly accessible) API to generate feed of posts for consumption in your feed reader of choice. Built daily with [Eleventy](https://www.11ty.dev) and [GitHub Actions](https://docs.github.com/en/actions).

## Usage

Add any of the following URLs to your preferred feed reader:

- [Atom v1.0](https://jgarber623.github.io/nasa-iotd/feed.atom)
- [JSON Feed v1.1](https://jgarber623.github.io/nasa-iotd/feed.json)

## License

The source code for this project is dedicated to the public domain per the [Creative Commons CC0 1.0 Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/).

The content of the Markdown (`*.md`) files in the `./src/_posts` folder was parsed from NASA's "ubernode search" API endpoint. The IotD website uses this endpoint to hydrate (as they say) the website's front-end by way of a _lot_ of JavaScript. Content authors are appropriately attributed in each feed item. Image credit information (when available) is displayed alongside each post's content.

NASA's "Meatball" logo graphic was downloaded from the [Symbols of NASA](https://www.nasa.gov/audience/forstudents/5-8/features/symbols-of-nasa.html) website. Permission was not obtained in accordance with NASA's [Media Usage Guidelines](https://www.nasa.gov/multimedia/guidelines/index.html).
