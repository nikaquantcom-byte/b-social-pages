/*
  B-Social Tag Engine — "Superhjernen"
  Forbinder tags på kryds og tværs af alle sider:
  Feed, Udforsk, Kort, Firma, Henvisning
*/
import { TAG_TREE, type TagNode } from "./tagTree";
import type { Event } from "./data";

// --- Tag Storage (localStorage) ---
const STORAGE_KEY = "bsocial_user_tags";
const FIRMA_TAGS_KEY = "bsocial_firma_tags";

export function getUserTags(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function setUserTags(tags: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
  window.dispatchEvent(new CustomEvent("bsocial-tags-changed", { detail: tags }));
}

export function getFirmaTags(): string[] {
  try {
    const raw = localStorage.getItem(FIRMA_TAGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function setFirmaTags(tags: string[]) {
  localStorage.setItem(FIRMA_TAGS_KEY, JSON.stringify(tags));
}

// --- Tag Graph: find related tags ---
function flattenTree(nodes: TagNode[]): TagNode[] {
  const flat: TagNode[] = [];
  for (const n of nodes) {
    flat.push(n);
    if (n.children) flat.push(...flattenTree(n.children));
  }
  return flat;
}

const ALL_TAGS = flattenTree(TAG_TREE);

export function getTagNode(tag: string): TagNode | undefined {
  return ALL_TAGS.find(t => t.tag === tag.toLowerCase());
}

export function getRelatedTags(tag: string): string[] {
  const node = ALL_TAGS.find(t => t.tag === tag.toLowerCase());
  if (!node) return [];
  // Return siblings (same parent) + children
  const related: string[] = [];
  for (const parent of TAG_TREE) {
    if (parent.tag === tag) {
      related.push(...(parent.children?.map(c => c.tag) || []));
    }
    if (parent.children) {
      const isChild = parent.children.some(c => c.tag === tag);
      if (isChild) {
        related.push(parent.tag);
        related.push(...parent.children.filter(c => c.tag !== tag).map(c => c.tag));
      }
      for (const child of parent.children) {
        if (child.children) {
          const isGrandchild = child.children.some(c => c.tag === tag);
          if (isGrandchild) {
            related.push(child.tag);
            related.push(...child.children.filter(c => c.tag !== tag).map(c => c.tag));
          }
        }
      }
    }
  }
  return [...new Set(related)];
}

// --- Co-occurrence: which tags appear together ---
export function buildCoOccurrence(events: Event[]): Map<string, Map<string, number>> {
  const matrix = new Map<string, Map<string, number>>();
  for (const ev of events) {
    const tags = ev.interest_tags || [];
    for (const t1 of tags) {
      if (!matrix.has(t1)) matrix.set(t1, new Map());
      for (const t2 of tags) {
        if (t1 !== t2) {
          const row = matrix.get(t1)!;
          row.set(t2, (row.get(t2) || 0) + 1);
        }
      }
    }
  }
  return matrix;
}

// --- Scoring: rank events by tag match ---
export function scoreEvent(event: Event, userTags: string[]): number {
  if (userTags.length === 0) return 0;
  const eventTags = new Set([
    ...(event.interest_tags || []),
    event.category?.toLowerCase()
  ].filter(Boolean));
  
  let score = 0;
  for (const ut of userTags) {
    if (eventTags.has(ut.toLowerCase())) score += 10; // Direct match
    const related = getRelatedTags(ut);
    for (const rt of related) {
      if (eventTags.has(rt)) score += 3; // Related match
    }
  }
  return score;
}

// --- Feed builder: group events by user tags ---
export interface TagSection {
  tag: string;
  label: string;
  emoji: string;
  events: Event[];
}

export function buildTagFeed(events: Event[], userTags: string[]): TagSection[] {
  if (userTags.length === 0) return [];
  const sections: TagSection[] = [];
  for (const tag of userTags) {
    const node = getTagNode(tag);
    const related = [tag, ...getRelatedTags(tag)];
    const matched = events.filter(ev => {
      const eTags = new Set([
        ...(ev.interest_tags || []),
        ev.category?.toLowerCase()
      ].filter(Boolean));
      return related.some(r => eTags.has(r.toLowerCase()));
    });
    if (matched.length > 0) {
      sections.push({
        tag,
        label: node?.label || tag,
        emoji: node?.emoji || "\u2B50",
        events: matched.slice(0, 6)
      });
    }
  }
  return sections;
}

// --- Firma targeting: match firma tags to user reach ---
export function estimateFirmaReach(firmaTags: string[], allUserTags: string[][]): number {
  const firmaSet = new Set(firmaTags.map(t => t.toLowerCase()));
  let matchCount = 0;
  for (const userTags of allUserTags) {
    const hasOverlap = userTags.some(ut => {
      if (firmaSet.has(ut.toLowerCase())) return true;
      const related = getRelatedTags(ut);
      return related.some(r => firmaSet.has(r.toLowerCase()));
    });
    if (hasOverlap) matchCount++;
  }
  return matchCount;
}

// --- Kort: filter events by tags for map ---
export function filterEventsForMap(events: Event[], activeTags: string[]): Event[] {
  if (activeTags.length === 0) return events;
  const expanded = new Set<string>();
  for (const t of activeTags) {
    expanded.add(t.toLowerCase());
    getRelatedTags(t).forEach(r => expanded.add(r.toLowerCase()));
  }
  return events.filter(ev => {
    const eTags = [
      ...(ev.interest_tags || []),
      ev.category?.toLowerCase()
    ].filter(Boolean);
    return eTags.some(et => expanded.has(et!.toLowerCase()));
  });
}

// --- Search: fuzzy tag search across tree ---
export function searchAllTags(query: string): TagNode[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return ALL_TAGS.filter(t =>
    t.tag.includes(q) || t.label.toLowerCase().includes(q)
  ).slice(0, 20);
}

// --- Henvisning: tag-based referral matching ---
export function getReferralTagMatch(referrerTags: string[], newUserTags: string[]): number {
  const referrerSet = new Set(referrerTags.map(t => t.toLowerCase()));
  let matches = 0;
  for (const tag of newUserTags) {
    if (referrerSet.has(tag.toLowerCase())) matches++;
    const related = getRelatedTags(tag);
    if (related.some(r => referrerSet.has(r.toLowerCase()))) matches += 0.5;
  }
  return Math.min(100, Math.round((matches / Math.max(newUserTags.length, 1)) * 100));
}

export { ALL_TAGS };

// --- Trending tags: count tag frequency across events ---
export function getTrendingTags(events: Event[], limit = 15): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const ev of events) {
    for (const t of ev.interest_tags || []) {
      counts.set(t, (counts.get(t) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

// --- Filter events by tag (with related tag expansion) ---
export function filterByTag(events: Event[], tag: string): Event[] {
  const expanded = new Set<string>();
  expanded.add(tag.toLowerCase());
  getRelatedTags(tag).forEach(r => expanded.add(r.toLowerCase()));
  return events.filter(ev => {
    const eTags = [...(ev.interest_tags || []), ev.category?.toLowerCase()].filter(Boolean);
    return eTags.some(et => expanded.has(et!.toLowerCase()));
  });
}

// --- Unified tagEngine object for convenient imports ---
export const tagEngine = {
  getUserTags,
  setUserTags,
  getFirmaTags,
  setFirmaTags,
  getTagNode,
  getRelatedTags: (tag: string, events?: Event[], limit?: number) => {
    const related = getRelatedTags(tag);
    if (!limit) return related.map(t => ({ tag: t }));
    return related.slice(0, limit).map(t => ({ tag: t }));
  },
  getTrendingTags,
  filterByTag,
  buildTagFeed,
  scoreEvent,
  searchAllTags,
  filterEventsForMap,
  estimateFirmaReach,
  getReferralTagMatch,
  buildCoOccurrence,
};
