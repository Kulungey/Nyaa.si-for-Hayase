# Nyaa.si Extension for Hayase

A source extension for [Hayase](https://github.com/hayase-app/ui) that pulls anime torrent results from [nyaa.si](https://nyaa.si/) using its public RSS feed.

> **Disclaimer:** This extension only searches nyaa.si's public RSS feed and returns magnet links. Hayase does not host, index, or provide any content — you are responsible for what you access and for complying with your local laws.

## Features

- Searches nyaa.si's RSS feed (`?page=rss`) for anime torrents
- Filters to the "Anime - English-translated" category by default
- Parses seeders, leechers, download counts, file size, and trusted/uploader status directly from the feed
- Builds a working magnet link from the torrent's info hash (nyaa's RSS doesn't include a magnet link directly, so a handful of public trackers are attached)

## Installation

1. Open Hayase and go to **Settings → Extensions → Repositories**.
2. Paste this repo's manifest URL:
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/manifest.json
   ```
3. Click **Import Extensions**.
4. Find **Nyaa.si** under the Extensions tab and enable it.

## Repo structure

| File            | Purpose                                                                 |
|------------------|--------------------------------------------------------------------------|
| `manifest.json`  | Extension metadata Hayase reads to install/update the extension          |
| `nyaa.js`        | The bundled extension source code                                        |
| `src.js`         | Unbundled/readable source (edit this, then rebuild `nyaa.js` from it)    |

## Development

If you want to modify the extension:

1. Edit `src.js`.
2. Rebuild the bundle with [esbuild](https://esbuild.github.io/):
   ```bash
   npx esbuild src.js --bundle --format=esm --outfile=nyaa.js
   ```
3. Bump the `"version"` field in `manifest.json` (Hayase only re-fetches the extension when the version number increases).
4. Commit and push — Hayase will pick up the update automatically on next launch.

## Notes

- The category filter is hardcoded to `c=1_2` (Anime - English-translated) in `src.js`. Change it to `c=1_0` for all anime categories, or remove the `c` param entirely for every category on the site.
- Results are marked `accuracy: "high"` when nyaa's `trusted` flag is `Yes`, and `"medium"` otherwise.
- No manual `type` (`best`/`alt`) is set on results, since that should only be assigned to manually verified releases.

## License

MIT — do whatever you want with it.
