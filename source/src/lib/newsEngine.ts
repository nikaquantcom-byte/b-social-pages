/*
  B-Social News Engine
  Henter nyheder fra RSS feeds og matcher dem med brugerens tags
  via Superhjernen. Bruger api.codetabs.com som CORS proxy.
*/

import { TAG_TREE, type TagNode } from "./tagTree";
import { getRelatedTags, getTagNode } from "./tagEngine";

// --- Types ---
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string | null;
  source: string;
  sourceEmoji: string;
  pubDate: Date;
  matchedTags: string[];
  score: number;
}

// --- RSS Feed Config mapped to tags ---
interface FeedConfig {
  url: string;
  source: string;
  sourceEmoji: string;
  tags: string[]; // Which tags this feed maps to
}

const RSS_FEEDS: FeedConfig[] = [
  {
    url: "https://nordjyske.dk/rss/sport",
    source: "Nordjyske Sport",
    sourceEmoji: "🏆",
    tags: ["cykling", "løb", "fodbold", "svømning", "fitness", "kampsport", "basketball", "tennis", "golf", "ski", "snowboard", "ridning"],
  },
  {
    url: "https://nordjyske.dk/rss/aalborg",
    source: "Nordjyske Aalborg",
    sourceEmoji: "🎨",
    tags: ["kunst", "musik", "dans", "fotografering", "teater", "stand-up", "festival", "koncert"],
  },
  {
    url: "https://nordjyske.dk/rss/nyheder",
    source: "Nordjyske",
    sourceEmoji: "📰",
    tags: ["social", "familie", "natur", "outdoor", "frivilligt", "tech", "mad", "shopping", "motor", "rejser"],
  },
];

// --- CORS Proxy ---
const PROXY = "https://api.codetabs.com/v1/proxy?quest=";

// --- Cache ---
const CACHE_KEY = "bsocial_news_v3";
const CACHE_TTL = 30 * 60 * 1000; // 30 min

interface NewsCache {
  timestamp: number;
  items: NewsItem[];
}

function getCache(): NewsCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache: NewsCache = JSON.parse(raw);
    if (Date.now() - cache.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    // Restore Date objects
    cache.items = cache.items.map(i => ({ ...i, pubDate: new Date(i.pubDate) }));
    return cache;
  } catch { return null; }
}

function setCache(items: NewsItem[]): void {
  try {
    const cache: NewsCache = { timestamp: Date.now(), items };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* localStorage full */ }
}

// --- RSS Parser ---
function parseRSS(xml: string, config: FeedConfig): NewsItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const items = doc.querySelectorAll("item");
  const results: NewsItem[] = [];

  items.forEach((item, idx) => {
    const title = item.querySelector("title")?.textContent?.trim() || "";
    const description = item.querySelector("description")?.textContent?.trim() || "";
    const link = item.querySelector("link")?.textContent?.trim() || "";
    const pubDateStr = item.querySelector("pubDate")?.textContent?.trim();
    const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();

    // Try to extract image from enclosure, media:content, or description
    let image: string | null = null;
    const enclosure = item.querySelector("enclosure");
    if (enclosure?.getAttribute("type")?.startsWith("image")) {
      image = enclosure.getAttribute("url");
    }
    const mediaContent = item.querySelector("content");
    if (!image && mediaContent?.getAttribute("url")) {
      image = mediaContent.getAttribute("url");
    }
    // Fallback: extract first img src from description HTML
    if (!image && description) {
      const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/);
      if (imgMatch) image = imgMatch[1];
    }

    // Tag matching: scan title + description for tag keywords
    const matchedTags = matchTagsToContent(title + " " + description, config.tags);

    results.push({
      id: `news-${config.source}-${idx}-${pubDate.getTime()}`,
      title,
      description: stripHtml(description).slice(0, 150),
      link,
      image,
      source: config.source,
      sourceEmoji: config.sourceEmoji,
      pubDate,
      matchedTags,
      score: 0,
    });
  });

  return results;
}

// --- Strip HTML tags from string ---
function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// --- Flatten all tags for keyword matching ---
function flattenAllTags(): { tag: string; label: string; keywords: string[] }[] {
  const flat: { tag: string; label: string; keywords: string[] }[] = [];
  for (const parent of TAG_TREE) {
    flat.push({
      tag: parent.tag,
      label: parent.label,
      keywords: [parent.tag, parent.label.toLowerCase()],
    });
    if (parent.children) {
      for (const child of parent.children) {
        flat.push({
          tag: child.tag,
          label: child.label,
          keywords: [child.tag, child.label.toLowerCase()],
        });
      }
    }
  }
  return flat;
}

const ALL_TAG_KEYWORDS = flattenAllTags();

// --- Match content text against tags ---
function matchTagsToContent(text: string, feedTags: string[]): string[] {
  const lower = text.toLowerCase();
  const matched = new Set<string>();

  // Always include feed-level tags if content has relevant words
  for (const ft of feedTags) {
    const node = getTagNode(ft);
    if (node && lower.includes(node.label.toLowerCase())) {
      matched.add(ft);
    }
  }

  // Scan for specific tag keywords in content
  for (const t of ALL_TAG_KEYWORDS) {
    for (const kw of t.keywords) {
      if (kw.length >= 3 && lower.includes(kw)) {
        matched.add(t.tag);
        break;
      }
    }
  }

  // If no specific matches, use the feed's default tags
  if (matched.size === 0 && feedTags.length > 0) {
    matched.add(feedTags[0]);
  }

  return [...matched];
}

// --- Score news item against user tags ---
export function scoreNewsItem(item: NewsItem, userTags: string[]): number {
  if (userTags.length === 0) return 0;
  let score = 0;
  const itemTags = new Set(item.matchedTags);

  for (const ut of userTags) {
    if (itemTags.has(ut.toLowerCase())) {
      score += 10; // Direct match
    }
    const related = getRelatedTags(ut);
    for (const rt of related) {
      if (itemTags.has(rt)) score += 3; // Related match
    }
  }

  // Recency bonus: newer articles get a small boost
  const hoursAgo = (Date.now() - item.pubDate.getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 6) score += 5;
  else if (hoursAgo < 24) score += 2;

  return score;
}

// --- Fetch all news ---
export async function fetchNews(): Promise<NewsItem[]> {
  // Check cache first
  const cached = getCache();
  if (cached) return cached.items;

  const allItems: NewsItem[] = [];

  const fetches = RSS_FEEDS.map(async (config) => {
    try {
      const res = await fetch(PROXY + encodeURIComponent(config.url), {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return [];
      const xml = await res.text();
      return parseRSS(xml, config);
    } catch {
      console.warn(`[NewsEngine] Failed to fetch ${config.source}`);
      return [];
    }
  });

  const results = await Promise.allSettled(fetches);
  for (const r of results) {
    if (r.status === "fulfilled") allItems.push(...r.value);
  }

  // Sort by date (newest first)
  allItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  // Only cache non-empty results
  if (allItems.length > 0) setCache(allItems);

  return allItems;
}

// --- Get personalized news for user tags ---
export function getPersonalizedNews(allNews: NewsItem[], userTags: string[]): NewsItem[] {
  if (userTags.length === 0) return allNews.slice(0, 10);

  // Score all items
  const scored = allNews.map(item => ({
    ...item,
    score: scoreNewsItem(item, userTags),
  }));

  // Filter to only items with score > 0, then sort by score
  return scored
    .filter(i => i.score > 0)
    .sort((a, b) => b.score - a.score || b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 20);
}

// --- Group news by tag sections (like buildTagFeed) ---
export interface NewsSection {
  tag: string;
  label: string;
  emoji: string;
  items: NewsItem[];
}

export function buildNewsSections(allNews: NewsItem[], userTags: string[]): NewsSection[] {
  if (userTags.length === 0) return [];

  const sections: NewsSection[] = [];

  for (const tag of userTags) {
    const node = getTagNode(tag);
    const related = [tag, ...getRelatedTags(tag)];
    const relatedSet = new Set(related.map(r => r.toLowerCase()));

    const matched = allNews.filter(item =>
      item.matchedTags.some(mt => relatedSet.has(mt.toLowerCase()))
    );

    if (matched.length > 0) {
      // Sort by date within section
      matched.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

      sections.push({
        tag,
        label: node?.label || tag,
        emoji: node?.emoji || "⭐",
        items: matched.slice(0, 5),
      });
    }
  }

  return sections;
}

// --- Format relative time in Danish ---
export function formatNewsTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Lige nu";
  if (mins < 60) return `${mins} min siden`;
  if (hours < 24) return `${hours} ${hours === 1 ? "time" : "timer"} siden`;
  if (days < 7) return `${days} ${days === 1 ? "dag" : "dage"} siden`;
  return date.toLocaleDateString("da-DK", { day: "numeric", month: "short" });
}
