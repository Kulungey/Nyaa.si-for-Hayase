# Nyaa.si / Sukebei Extensions for Hayase

Source extensions for [Hayase](https://github.com/hayase-app/ui) that pull torrent results from [nyaa.si](https://nyaa.si/) and [sukebei.nyaa.si](https://sukebei.nyaa.si/) using their public RSS feeds.

> **Disclaimer:** These extensions only search the sites' public RSS feeds and return magnet links. Hayase does not host, index, or provide any content — you are responsible for what you access and for complying with your local laws.

## Features

- Searches the Nyaa.si and Sukebei RSS feeds (`?page=rss`) for torrents
- Nyaa.si filters to the "Anime - English-translated" category by default; Sukebei searches all categories (no anime-specific split on that site)
- Parses seeders, leechers, download counts, file size, and trusted/uploader status directly from the feed
- Builds a working magnet link from the torrent's info hash (nyaa's RSS doesn't include a magnet link directly, so a handful of public trackers are attached)

## Installation

1. Open Hayase and go to **Settings → Extensions → Repositories**.
2. Paste this repo's manifest URL:
   ```
   https://raw.githubusercontent.com/Kulungey/Nyaa.si-for-Hayase/main/manifest.json
   ```
3. Click **Import Extensions**.
4. Find **Nyaa.si** and **Sukebei** under the Extensions tab and enable whichever you want.

## Repo structure

| File               | Purpose                                                                 |
|--------------------|--------------------------------------------------------------------------|
| `manifest.json`    | Extension metadata Hayase reads to install/update both extensions        |
| `nyaa.js`          | Bundled Nyaa.si extension code — this is what Hayase actually loads      |
| `src.js`           | *(optional)* Unbundled/readable source for Nyaa.si. Not required to work — edit this, then rebuild `nyaa.js` from it. |
| `sukebei.js`       | Bundled Sukebei extension code — this is what Hayase actually loads      |
| `sukebei-src.js`   | *(optional)* Unbundled/readable source for Sukebei. Edit this, then rebuild `sukebei.js` from it. |

## Development

If you want to modify an extension:

1. Edit `src.js` (Nyaa.si) or `sukebei-src.js` (Sukebei).
2. Rebuild the bundle with [esbuild](https://esbuild.github.io/):
   ```bash
   npx esbuild src.js --bundle --format=esm --outfile=nyaa.js
   npx esbuild sukebei-src.js --bundle --format=esm --outfile=sukebei.js
   ```
3. Bump the `"version"` field for the relevant entry in `manifest.json` (Hayase only re-fetches an extension when its version number increases).
4. Commit and push — Hayase will pick up the update automatically on next launch.

## Adding another source

Both extensions share the same shape: `single`/`batch`/`movie` methods that fetch an RSS feed and hand it to `parseRSS`, plus a `test()` health check. To add a new torrent source:

1. Copy `sukebei-src.js` as a starting template if the target site also runs Nyaa-style RSS (same `nyaa:*` XML tags) — `parseRSS`/`parseSize` can be reused as-is with just a new `base` URL.
2. For sites with a different feed format (JSON API, different XML tags), rewrite `parseRSS` to match that site's response shape while keeping the same return object structure (`title`, `link`, `hash`, `seeders`, `leechers`, `downloads`, `size`, `date`, `accuracy`).
3. Add a new array entry to `manifest.json` pointing at the new bundled file.

## Notes

- The category filter is hardcoded to `c=1_2` (Anime - English-translated) in `src.js`. Change it to `c=1_0` for all anime categories, or remove the `c` param entirely for every category on the site.
- Sukebei has no equivalent category split, so `sukebei-src.js` queries the whole site.
- Results are marked `accuracy: "high"` when the feed's `trusted` flag is `Yes`, and `"medium"` otherwise.
- No manual `type` (`best`/`alt`) is set on results, since that should only be assigned to manually verified releases.

## License

MIT — do whatever you want with it.
