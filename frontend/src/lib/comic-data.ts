import {
  getChapter as getChapterFromDb,
  getStoryBySlug,
  listChapters,
  listStories,
  StoryDto,
  ChapterDto,
  StorySort,
} from "@/services/story.service";

export type StoryStatus = "ongoing" | "completed" | "paused";
export type Story = StoryDto;
export type Chapter = ChapterDto;
export type StoryCollection = "hot" | "latest" | "tienHiep" | "kiemHiep" | "quanTruong";

export const featuredGenres = ["Tat ca", "Tien hiep", "Kiem hiep", "Ngon tinh", "Do thi", "Huyen huyen", "Quan truong"];

const collectionQuery: Record<StoryCollection, { sort?: StorySort; genre?: string }> = {
  hot: { sort: "hot" },
  latest: { sort: "latest" },
  tienHiep: { genre: "tien-hiep", sort: "updated" },
  kiemHiep: { genre: "kiem-hiep", sort: "updated" },
  quanTruong: { genre: "quan-truong", sort: "updated" },
};

async function safeList(collection: StoryCollection, limit: number) {
  try {
    const query = collectionQuery[collection];
    const result = await listStories({ ...query, page: 1, limit });
    return result.items;
  } catch {
    return [];
  }
}

export async function getHomeCollections() {
  const [hot, latest, tienHiep, kiemHiep] = await Promise.all([
    safeList("hot", 10),
    safeList("latest", 8),
    safeList("tienHiep", 8),
    safeList("kiemHiep", 8),
  ]);

  return { hot, latest, tienHiep, kiemHiep };
}

export async function getStories(collection: StoryCollection = "hot", limit = 24) {
  return safeList(collection, limit);
}

export async function searchStories(query: string, limit = 24) {
  try {
    const result = await listStories({ q: query, page: 1, limit });
    return result.items;
  } catch {
    return [];
  }
}

export async function findStoryBySlug(slug: string) {
  try {
    return getStoryBySlug(slug);
  } catch {
    return null;
  }
}

export async function getChapters(storySlug: string) {
  try {
    return (await listChapters(storySlug))?.items || [];
  } catch {
    return [];
  }
}

export async function getChapterPage(storySlug: string, page = 1, limit = 60) {
  try {
    return (await listChapters(storySlug, { page, limit })) || { items: [], total: 0, page, limit };
  } catch {
    return { items: [], total: 0, page, limit };
  }
}

export async function getChapter(storySlug: string, chapterSlug: string) {
  try {
    return getChapterFromDb(storySlug, chapterSlug);
  } catch {
    return null;
  }
}

export function statusLabel(status: StoryStatus) {
  if (status === "completed") return "Full";
  if (status === "paused") return "Tam dung";
  return "Dang ra";
}
