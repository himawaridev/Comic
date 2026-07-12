import { Op, WhereOptions } from "sequelize";
import { Author, Chapter, Genre, Story, Tag } from "@/models";
import { slugify } from "@/lib/slug";
import { proxiedImageUrl } from "@/lib/images";
import { ensureStoryChapterMetadata, refreshChapterContent } from "@/services/crawler.service";
import sanitizeHtml from "sanitize-html";

export type StorySort = "hot" | "latest" | "completed" | "new" | "updated";

export type StoryDto = {
  id: string;
  slug: string;
  title: string;
  coverUrl: string;
  author: string;
  latestChapter: string;
  updatedAt: string;
  genres: string[];
  status: "ongoing" | "completed" | "paused";
  rating: number;
  ratingCount: number;
  totalChapters: number;
  viewCount: number;
  description: string;
  sourceUrl?: string | null;
};

export type ChapterDto = {
  id: string;
  slug: string;
  title: string;
  chapterNumber: number;
  content: string[];
  contentHtml: string;
  contentText: string;
  wordCount: number;
  crawlStatus: "pending" | "success" | "short_content" | "failed";
  publishedAt: string | null;
};

const includeStory = [
  { model: Author, as: "author", attributes: ["name", "slug"] },
  { model: Genre, as: "genres", attributes: ["name", "slug"], through: { attributes: [] } },
  { model: Tag, as: "tags", attributes: ["name", "slug"], through: { attributes: [] } },
];

function orderFor(sort?: StorySort) {
  if (sort === "hot") return [["hotScore", "DESC"], ["updatedAt", "DESC"]] as [string, string][];
  if (sort === "new") return [["createdAt", "DESC"]] as [string, string][];
  if (sort === "completed") return [["lastChapterAt", "DESC"], ["updatedAt", "DESC"]] as [string, string][];
  return [["lastChapterAt", "DESC"], ["updatedAt", "DESC"]] as [string, string][];
}

function chapterTitle(story: InstanceType<typeof Story>) {
  const total = story.getDataValue("totalChapters");
  return total > 0 ? `Chuong ${total}` : "Chua co chuong";
}

export function toStoryDto(story: InstanceType<typeof Story>): StoryDto {
  const raw = story.get({ plain: true }) as Record<string, any>;
  return {
    id: String(raw.id),
    slug: raw.slug,
    title: raw.title,
    coverUrl: proxiedImageUrl(raw.coverUrlHighRes || raw.coverUrl),
    author: raw.author?.name || "Dang cap nhat",
    latestChapter: chapterTitle(story),
    updatedAt: raw.lastChapterAt ? new Date(raw.lastChapterAt).toLocaleDateString("vi-VN") : new Date(raw.updatedAt).toLocaleDateString("vi-VN"),
    genres: raw.genres?.map((genre: { name: string }) => genre.name) || [],
    status: raw.status,
    rating: Number(raw.ratingAvg || 0),
    ratingCount: Number(raw.ratingCount || 0),
    totalChapters: Number(raw.totalChapters || 0),
    viewCount: Number(raw.viewCount || 0),
    description: raw.description || "",
    sourceUrl: raw.sourceUrl,
  };
}

export function toChapterDto(chapter: InstanceType<typeof Chapter>): ChapterDto {
  const raw = chapter.get({ plain: true }) as Record<string, any>;
  const contentText = String(raw.contentText || raw.content || "");
  const contentHtml = raw.contentHtml
    ? sanitizeHtml(String(raw.contentHtml), {
        allowedTags: ["p", "br", "img", "strong", "b", "em", "i", "blockquote", "h2", "h3", "hr", "ul", "ol", "li"],
        allowedAttributes: { img: ["src", "alt", "width", "height", "loading"] },
        allowedSchemes: ["https"],
        transformTags: { img: (_tagName, attribs) => ({ tagName: "img", attribs: { src: proxiedImageUrl(attribs.src), alt: attribs.alt || "", loading: "lazy" } }) },
      })
    : "";
  return {
    id: String(raw.id),
    slug: raw.slug,
    title: raw.title,
    chapterNumber: raw.chapterNumber || 0,
    content: contentText
      .split(/\n{2,}/)
      .map((line) => line.trim())
      .filter(Boolean),
    contentHtml,
    contentText,
    wordCount: Number(raw.wordCount || (contentText ? contentText.split(/\s+/).length : 0)),
    crawlStatus: raw.crawlStatus || (contentText.length >= 500 ? "success" : "pending"),
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt).toISOString() : null,
  };
}

export async function listStories({
  page = 1,
  limit = 24,
  q,
  genre,
  status,
  sort = "updated",
}: {
  page?: number;
  limit?: number;
  q?: string | null;
  genre?: string | null;
  status?: string | null;
  sort?: StorySort;
}) {
  const where: WhereOptions = {};
  if (q) {
    Object.assign(where, {
      [Op.or]: [
        { title: { [Op.iLike]: `%${q}%` } },
        { originalTitle: { [Op.iLike]: `%${q}%` } },
      ],
    });
  }
  if (status) Object.assign(where, { status });
  if (sort === "completed") Object.assign(where, { status: "completed" });

  const include = [...includeStory];
  if (genre) {
    include[1] = {
      model: Genre,
      as: "genres",
      attributes: ["name", "slug"],
      through: { attributes: [] },
      where: { slug: slugify(genre) },
    } as any;
  }

  const offset = (Math.max(page, 1) - 1) * limit;
  const result = await Story.findAndCountAll({
    where,
    include,
    distinct: true,
    limit,
    offset,
    order: orderFor(sort),
  });

  return {
    items: result.rows.map(toStoryDto),
    total: result.count,
    page,
    limit,
  };
}

export async function getStoryBySlug(slug: string) {
  const story = await Story.findOne({ where: { slug }, include: includeStory });
  return story ? toStoryDto(story) : null;
}

export async function getStoryModelBySlug(slug: string) {
  return Story.findOne({ where: { slug }, include: includeStory });
}

export async function listChapters(storySlug: string, options: { q?: string | null; chapterNumber?: number | null; page?: number; limit?: number } = {}) {
  try {
    await ensureStoryChapterMetadata(storySlug);
  } catch (error) {
    console.error(`[story] could not refresh chapter metadata for ${storySlug}:`, error);
  }
  const story = await Story.findOne({ where: { slug: storySlug } });
  if (!story) return null;
  const where: WhereOptions = { storyId: story.id };
  if (options.q) Object.assign(where, { title: { [Op.iLike]: `%${options.q}%` } });
  if (options.chapterNumber && options.chapterNumber > 0) Object.assign(where, { chapterNumber: options.chapterNumber });
  const page = Math.max(1, Number(options.page || 1));
  const limit = Math.min(200, Math.max(1, Number(options.limit || 60)));
  const { rows, count } = await Chapter.findAndCountAll({
    where,
    attributes: ["id", "slug", "title", "chapterNumber", "wordCount", "crawlStatus", "publishedAt"],
    order: [["chapterNumber", "ASC"], ["id", "ASC"]],
    limit,
    offset: (page - 1) * limit,
  });
  return { items: rows.map(toChapterDto), total: count, page, limit };
}

export async function getChapter(storySlug: string, chapterSlug: string) {
  const story = await Story.findOne({ where: { slug: storySlug }, include: includeStory });
  if (!story) return null;

  const current = await Chapter.findOne({ where: { storyId: story.id, slug: chapterSlug } });
  if (!current) return null;
  const currentText = current.getDataValue("contentText") || current.getDataValue("content") || "";
  if (current.getDataValue("crawlStatus") !== "success" || currentText.length < 500) {
    try {
      await refreshChapterContent(current);
    } catch (error) {
      console.error(`[reader] could not refresh ${current.getDataValue("sourceUrl")}:`, error);
    }
  }

  const metadataAttributes = ["id", "slug", "title", "chapterNumber", "wordCount", "crawlStatus", "publishedAt"];
  const [previous, next, chapterTotal] = await Promise.all([
    Chapter.findOne({ where: { storyId: story.id, id: { [Op.lt]: current.id } }, attributes: metadataAttributes, order: [["id", "DESC"]] }),
    Chapter.findOne({ where: { storyId: story.id, id: { [Op.gt]: current.id } }, attributes: metadataAttributes, order: [["id", "ASC"]] }),
    Chapter.count({ where: { storyId: story.id } }),
  ]);

  return {
    story: toStoryDto(story),
    chapter: toChapterDto(current),
    previousChapter: previous ? toChapterDto(previous) : null,
    nextChapter: next ? toChapterDto(next) : null,
    chapterTotal,
  };
}
