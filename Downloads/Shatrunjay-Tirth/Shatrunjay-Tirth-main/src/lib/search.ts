import Fuse from "fuse.js";
import { SearchItem, buildSearchIndex } from "@/data/search-index";

let fuseInstance: Fuse<SearchItem> | null = null;

export function getSearchInstance(): Fuse<SearchItem> {
  if (!fuseInstance) {
    const index = buildSearchIndex();
    fuseInstance = new Fuse(index, {
      keys: ["title", "titleGu", "snippet"],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
    });
  }
  return fuseInstance;
}
