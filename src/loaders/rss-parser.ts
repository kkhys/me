export interface RssItem {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
}

const stripCdata = (text: string): string =>
  text.replace(/^<!\[CDATA\[([\s\S]*?)]]>$/, "$1");

const decodeEntities = (text: string): string =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

const extractTag = (xml: string, tag: string): string | undefined => {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  if (!match?.[1]) return undefined;
  return decodeEntities(stripCdata(match[1].trim()));
};

export const parseRssItems = (xml: string): RssItem[] => {
  const items: RssItem[] = [];
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/g);

  if (!itemBlocks) return items;

  for (const block of itemBlocks) {
    const content = block.replace(/<\/?item>/g, "");

    const title = extractTag(content, "title");
    const link = extractTag(content, "link");
    const guid = extractTag(content, "guid");
    const pubDate = extractTag(content, "pubDate");

    if (title && link && guid && pubDate) {
      items.push({ title, link, guid, pubDate });
    }
  }

  return items;
};

export const generateRssEntryId = (guid: string, prefix = "rss"): string => {
  const slug = guid.replace(/\/$/, "").split("/").pop();
  return `${prefix}-${slug}`;
};
