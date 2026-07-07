// sukebei-src.js
var sukebei_src_default = new class Sukebei {
  base = "https://sukebei.nyaa.si/";
  // Public trackers to attach to the magnet link since nyaa's RSS doesn't include one
  trackers = [
    "udp://tracker.opentrackr.org:1337/announce",
    "udp://open.stealth.si:80/announce",
    "udp://tracker.torrent.eu.org:451/announce",
    "udp://exodus.desync.com:6969/announce"
  ];
  async single(query) {
    const { titles, episode, fetch: fetch2 } = query;
    if (!titles?.length) return [];
    const q = titles[0] + (episode ? ` ${episode}` : "");
    const url = `${this.base}?page=rss&q=${encodeURIComponent(q)}`;
    const res = await fetch2(url);
    const text = await res.text();
    return this.parseRSS(text);
  }
  batch = this.single;
  movie = this.single;
  parseRSS(text) {
    const results = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/;
    const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
    const infoHashRegex = /<nyaa:infoHash>(.*?)<\/nyaa:infoHash>/;
    const seedersRegex = /<nyaa:seeders>(\d+)<\/nyaa:seeders>/;
    const leechersRegex = /<nyaa:leechers>(\d+)<\/nyaa:leechers>/;
    const downloadsRegex = /<nyaa:downloads>(\d+)<\/nyaa:downloads>/;
    const sizeRegex = /<nyaa:size>([\d.]+\s*\w+)<\/nyaa:size>/;
    const trustedRegex = /<nyaa:trusted>(Yes|No)<\/nyaa:trusted>/;
    let match;
    while ((match = itemRegex.exec(text)) !== null) {
      const item = match[1];
      const titleMatch = item.match(titleRegex);
      const hashMatch = item.match(infoHashRegex);
      if (!titleMatch || !hashMatch) continue;
      const title = titleMatch[1];
      const hash = hashMatch[1];
      const seeders = parseInt(item.match(seedersRegex)?.[1] ?? "0", 10);
      const leechers = parseInt(item.match(leechersRegex)?.[1] ?? "0", 10);
      const downloads = parseInt(item.match(downloadsRegex)?.[1] ?? "0", 10);
      const sizeStr = item.match(sizeRegex)?.[1];
      const size = sizeStr ? this.parseSize(sizeStr) : 0;
      const trusted = item.match(trustedRegex)?.[1] === "Yes";
      const pubDate = item.match(pubDateRegex)?.[1];
      const date = pubDate ? new Date(pubDate) : /* @__PURE__ */ new Date();
      const trackerParams = this.trackers.map((t) => `&tr=${encodeURIComponent(t)}`).join("");
      const magnet = `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}${trackerParams}`;
      results.push({
        title,
        link: magnet,
        hash,
        seeders,
        leechers,
        downloads,
        size,
        date,
        accuracy: trusted ? "high" : "medium"
      });
    }
    return results;
  }
  parseSize(sizeStr) {
    const match = sizeStr.match(/([\d.]+)\s*(KiB|MiB|GiB|KB|MB|GB)/i);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    switch (unit) {
      case "KIB":
      case "KB":
        return value * 1024;
      case "MIB":
      case "MB":
        return value * 1024 * 1024;
      case "GIB":
      case "GB":
        return value * 1024 * 1024 * 1024;
      default:
        return 0;
    }
  }
  async test() {
    try {
      const res = await fetch(this.base);
      if (!res.ok) throw new Error("sukebei.nyaa.si did not respond OK");
      return true;
    } catch (e) {
      throw new Error(`Could not reach sukebei.nyaa.si: ${e.message}`);
    }
  }
}();
export {
  sukebei_src_default as default
};
