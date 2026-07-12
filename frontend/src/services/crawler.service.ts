import * as cheerio from "cheerio";
import sanitizeHtml from "sanitize-html";
import { Op } from "sequelize";
import { Author, Chapter, CrawlSource, Genre, Story, Tag } from "@/models";
import { sequelize } from "@/lib/sequelize";
import { slugify } from "@/lib/slug";

const SOURCE_BASE = "https://truyenhoan.com";
const MIN_CONTENT_LENGTH = 500;
const CHAPTER_INDEX_CONCURRENCY = 4;
const STORY_CRAWL_CONCURRENCY = 2;
const CATALOG_UPSERT_CONCURRENCY = 8;
const CONTENT_CRAWL_CONCURRENCY = 3;

const categoryConfig = {
  hot: { path: "/truyen-hot/", hotScore: 100, genre: null },
  latest: { path: "/truyen-moi-cap-nhat/", hotScore: 40, genre: null },
  tienHiep: { path: "/truyen-tien-hiep/hoan/", hotScore: 55, genre: "Tien hiep" },
  kiemHiep: { path: "/truyen-kiem-hiep/hoan/", hotScore: 55, genre: "Kiem hiep" },
  quanTruong: { path: "/truyen-quan-truong/hoan/", hotScore: 35, genre: "Quan truong" },
} as const;

export type CategoryKey = keyof typeof categoryConfig;

export type SourceGenreCategory = {
  key: string;
  name: string;
  path: string;
};

type CrawlStoryListItem = {
  title: string;
  sourceUrl: string;
  coverUrl?: string;
  authorName?: string;
  chapterText?: string;
};

type DetailChapter = {
  title: string;
  slug: string;
  sourceUrl: string;
  chapterNumber: number | null;
};

type StoryDetail = {
  title: string;
  description: string;
  coverUrl?: string;
  coverUrlHighRes?: string;
  authorName: string;
  ratingAvg: number;
  ratingCount: number;
  status: "ongoing" | "completed" | "paused";
  genres: string[];
  tags: string[];
  chapters: DetailChapter[];
  chapterIndexPages: number;
};

type ParsedChapterContent = {
  contentHtml: string;
  contentText: string;
  wordCount: number;
  crawlStatus: "success" | "short_content";
};

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, worker: (item: T, index: number) => Promise<R>) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(Math.max(concurrency, 1), items.length) }, () => runWorker()));
  return results;
}

function absoluteUrl(value?: string | null, base = SOURCE_BASE) {
  if (!value) return "";
  try {
    return new URL(value, base).toString();
  } catch {
    return "";
  }
}

function foldVietnamese(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "D");
}

function isSourceUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "truyenhoan.com" || url.hostname.endsWith(".truyenhoan.com"));
  } catch {
    return false;
  }
}

function looksBlocked(html: string) {
  const folded = html.toLowerCase();
  return folded.includes("cf-chl-") || folded.includes("captcha") || folded.includes("attention required") || folded.includes("cloudflare ray id");
}

async function fetchHtml(url: string, attempt = 1): Promise<string> {
  const safeUrl = absoluteUrl(url);
  if (!isSourceUrl(safeUrl)) throw new Error(`Crawler refused non-whitelisted source: ${safeUrl}`);

  try {
    const response = await fetch(safeUrl, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "accept-language": "vi,en;q=0.8",
        "user-agent": "Mozilla/5.0 (compatible; TruyenHoanCrawler/2.0; +local-development)",
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    if (looksBlocked(html)) throw new Error("Source returned a Cloudflare/captcha challenge");
    return html;
  } catch (error) {
    if (attempt >= 3) throw error;
    await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    return fetchHtml(url, attempt + 1);
  }
}

function parseChapterNumber(title: string) {
  const match = foldVietnamese(title).match(/chuong\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function normalizeStatus(value: string): "ongoing" | "completed" | "paused" {
  const lower = foldVietnamese(value).toLowerCase();
  if (lower.includes("full") || lower.includes("hoan")) return "completed";
  if (lower.includes("tam") || lower.includes("pause")) return "paused";
  return "ongoing";
}

function largestSrcset(value?: string) {
  if (!value) return "";
  const candidates = value
    .split(",")
    .map((part) => {
      const [url, descriptor = "0"] = part.trim().split(/\s+/);
      return { url, width: Number(descriptor.replace(/[^0-9.]/g, "")) || 0 };
    })
    .filter((item) => item.url);
  return candidates.sort((a, b) => b.width - a.width)[0]?.url || "";
}

function imageFromElement($element: cheerio.Cheerio<cheerio.Element>, pageUrl: string) {
  const candidates = [
    $element.attr("src"),
    $element.attr("data-src"),
    largestSrcset($element.attr("srcset") || $element.attr("data-srcset")),
    $element.attr("data-original"),
    $element.attr("data-lazy-src"),
    $element.attr("data-image"),
    $element.attr("data-pc"),
    $element.attr("data-mb"),
  ];
  return candidates.map((value) => absoluteUrl(value, pageUrl)).find(Boolean) || "";
}

function parseList(html: string, pageUrl: string): CrawlStoryListItem[] {
  const $ = cheerio.load(html);
  const items: CrawlStoryListItem[] = [];

  $(".row").each((_, element) => {
    const title = $(element).find(".truyen-title").text().trim();
    const sourceUrl = absoluteUrl($(element).find(".truyen-title a").attr("href"), pageUrl);
    if (!title || !sourceUrl) return;

    const image = $(element).find(".col-list-image img").first();
    const deskImage = $(element).find(".col-list-image [data-desk-image]").first().attr("data-desk-image");
    items.push({
      title,
      sourceUrl,
      coverUrl: absoluteUrl(deskImage, pageUrl) || imageFromElement(image, pageUrl),
      authorName: $(element).find(".glyphicon-pencil").parent().text().trim(),
      chapterText: $(element).find(".glyphicon-list").parent().text().trim(),
    });
  });

  return items;
}

function paginationPageCount(html: string) {
  const $ = cheerio.load(html);
  let maxPage = 1;
  $('.pagination a[href*="trang-"]').each((_, element) => {
    const match = ($(element).attr("href") || "").match(/trang-(\d+)/i);
    if (match) maxPage = Math.max(maxPage, Number(match[1]));
  });
  return maxPage;
}

function cleanGenreName(value: string) {
  return value.replace(/^Truyen\s+/i, "").replace(/\s+Hoan$/i, "").trim();
}

function categoryName(value: string) {
  return cleanGenreName(foldVietnamese(value));
}

export async function discoverSourceGenres(): Promise<SourceGenreCategory[]> {
  const html = await fetchHtml(SOURCE_BASE);
  const $ = cheerio.load(html);
  const categories = new Map<string, SourceGenreCategory>();
  $('a[href*="/truyen-"][href*="/hoan/"]').each((_, element) => {
    const url = absoluteUrl($(element).attr("href"), SOURCE_BASE);
    if (!url) return;
    const pathname = new URL(url).pathname;
    const match = pathname.match(/^\/truyen-([^/]+)\/hoan\/$/i);
    if (!match) return;
    const name = categoryName($(element).text().replace(/\s+/g, " ").trim());
    if (!name) return;
    categories.set(match[1], { key: match[1], name, path: pathname });
  });
  return Array.from(categories.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function parseChapterList(html: string, pageUrl: string): DetailChapter[] {
  const $ = cheerio.load(html);
  const chapters: DetailChapter[] = [];
  $(".list-chapter li a").each((index, element) => {
    const rawTitle = $(element).text().replace(/\s+/g, " ").trim();
    const sourceUrl = absoluteUrl($(element).attr("href"), pageUrl);
    if (!rawTitle || !sourceUrl) return;
    const chapterNumber = parseChapterNumber(rawTitle);
    const sourceSlug = new URL(sourceUrl).pathname.split("/").filter(Boolean).at(-1)?.replace(/\.html$/i, "");
    chapters.push({
      title: rawTitle,
      slug: slugify(rawTitle) || sourceSlug || `chuong-${chapterNumber ?? index + 1}`,
      sourceUrl,
      chapterNumber,
    });
  });
  return chapters;
}

function chapterIndexPageCount(html: string) {
  return paginationPageCount(html);
}

function parseDetailBase(html: string, sourceUrl: string): Omit<StoryDetail, "chapters" | "chapterIndexPages"> {
  const $ = cheerio.load(html);
  const title = $(".title").first().text().trim();
  const authorName = $('.info a[itemprop="author"]').text().trim() || "Dang cap nhat";
  const genres = new Set<string>();
  const tags = new Set<string>();

  $('.info a[itemprop="genre"], .info a[href*="/the-loai/"], .info a[href*="/truyen-"]').each((_, element) => {
    const text = categoryName($(element).text().trim());
    if (text && text.length < 40) genres.add(text);
  });
  $('a[href*="/tag/"]').each((_, element) => {
    const text = $(element).text().trim();
    if (text) tags.add(text);
  });

  const detailImage = $(".book img").first();
  const ogImage = $('meta[property="og:image"], meta[name="og:image"]').first().attr("content");
  const detailCover = imageFromElement(detailImage, sourceUrl);
  const coverUrlHighRes = absoluteUrl(ogImage, sourceUrl) || detailCover;

  return {
    title,
    description: $(".desc-text").text().replace(/\s+/g, " ").trim(),
    coverUrl: detailCover || coverUrlHighRes,
    coverUrlHighRes,
    authorName,
    ratingAvg: Number($('span[itemprop="ratingValue"]').text().trim()) || 0,
    ratingCount: Number($('span[itemprop="ratingCount"]').text().trim()) || 0,
    status: normalizeStatus($(".info .text-primary").text().trim() || $(".info .text-success").text().trim()),
    genres: Array.from(genres),
    tags: Array.from(tags),
  };
}

async function parseStoryDetail(html: string, sourceUrl: string): Promise<StoryDetail> {
  const pageCount = chapterIndexPageCount(html);
  const pages: string[] = [html];

  for (let start = 2; start <= pageCount; start += CHAPTER_INDEX_CONCURRENCY) {
    const numbers = Array.from({ length: Math.min(CHAPTER_INDEX_CONCURRENCY, pageCount - start + 1) }, (_, index) => start + index);
    pages.push(...(await Promise.all(numbers.map((page) => fetchHtml(`${sourceUrl.replace(/\/$/, "")}/trang-${page}/#chapter-list`)))));
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  const chapterMap = new Map<string, DetailChapter>();
  pages.flatMap((pageHtml) => parseChapterList(pageHtml, sourceUrl)).forEach((chapter) => chapterMap.set(chapter.sourceUrl, chapter));
  const chapters = Array.from(chapterMap.values()).sort((a, b) => {
    if (a.chapterNumber !== null && b.chapterNumber !== null) return a.chapterNumber - b.chapterNumber;
    return a.sourceUrl.localeCompare(b.sourceUrl, undefined, { numeric: true });
  });

  return { ...parseDetailBase(html, sourceUrl), chapters, chapterIndexPages: pageCount };
}

export function parseChapterContent(html: string, sourceUrl: string): ParsedChapterContent {
  if (looksBlocked(html)) throw new Error("Source returned a Cloudflare/captcha challenge");
  const $ = cheerio.load(html);
  const content = $("#chapter-c").length ? $("#chapter-c").first() : $(".chapter-c").first();
  if (!content.length) throw new Error("Chapter content selector #chapter-c/.chapter-c was not found");

  content
    .find("script, style, noscript, ins, iframe, form, nav, footer, .ads, .adsbygoogle, .chapter-nav, .comments, .comment, [hidden], [aria-hidden='true'], [style*='display:none'], [style*='display: none']")
    .remove();

  content.find("img").each((_, element) => {
    const image = $(element);
    const src = imageFromElement(image, sourceUrl);
    if (!src || !isSourceUrl(src)) image.remove();
    else image.attr("src", src);
  });

  const contentHtml = sanitizeHtml(content.html() || "", {
    allowedTags: ["p", "br", "img", "strong", "b", "em", "i", "blockquote", "h2", "h3", "hr", "ul", "ol", "li"],
    allowedAttributes: { img: ["src", "alt", "width", "height", "loading"] },
    allowedSchemes: ["https"],
    transformTags: {
      img: (_tagName, attribs) => ({
        tagName: "img",
        attribs: { src: attribs.src, alt: attribs.alt || "", loading: "lazy" },
      }),
    },
    exclusiveFilter: (frame) => frame.tag === "img" && !isSourceUrl(frame.attribs.src || ""),
  }).trim();

  const textDocument = cheerio.load(`<main>${contentHtml}</main>`);
  textDocument("br").replaceWith("\n");
  textDocument("p, blockquote, h2, h3, li").each((_, element) => {
    textDocument(element).append("\n\n");
  });
  const contentText = textDocument("main")
    .text()
    .replace(/\r/g, "")
    .split(/\n+/)
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
  const wordCount = contentText ? contentText.split(/\s+/).length : 0;

  return {
    contentHtml,
    contentText,
    wordCount,
    crawlStatus: contentText.length >= MIN_CONTENT_LENGTH ? "success" : "short_content",
  };
}

async function upsertTextModel(model: typeof Author | typeof Genre | typeof Tag, name: string) {
  const slug = slugify(name);
  const [record] = await model.findOrCreate({ where: { slug }, defaults: { name, slug } as never });
  return record;
}

function uniqueBySlug<T extends { get(key: string): unknown }>(records: T[]) {
  const seen = new Set<string>();
  return records.filter((record) => {
    const slug = String(record.get("slug"));
    if (seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
}

export async function refreshChapterContent(chapterOrId: InstanceType<typeof Chapter> | number, options: { force?: boolean } = {}) {
  const chapter = typeof chapterOrId === "number" ? await Chapter.findByPk(chapterOrId) : chapterOrId;
  if (!chapter) throw new Error("Chapter not found");
  const existingText = chapter.getDataValue("contentText") || chapter.getDataValue("content") || "";
  if (!options.force && chapter.getDataValue("crawlStatus") === "success" && existingText.length >= MIN_CONTENT_LENGTH) {
    return { status: "skipped" as const, chapter };
  }

  const sourceUrl = chapter.getDataValue("sourceUrl");
  if (!sourceUrl) throw new Error("Chapter has no source URL");

  try {
    const parsed = parseChapterContent(await fetchHtml(sourceUrl), sourceUrl);
    const isMuchShorter = existingText.length >= MIN_CONTENT_LENGTH && parsed.contentText.length < existingText.length * 0.7;
    if (isMuchShorter) {
      const warning = `Skipped shorter content (${parsed.contentText.length} < ${existingText.length})`;
      console.warn(`[crawler] ${chapter.getDataValue("title")}: ${warning}`);
      await chapter.update({ crawlError: warning, lastCrawledAt: new Date() });
      return { status: "skipped" as const, chapter };
    }

    await chapter.update({
      content: parsed.contentText,
      contentHtml: parsed.contentHtml,
      contentText: parsed.contentText,
      wordCount: parsed.wordCount,
      crawlStatus: parsed.crawlStatus,
      crawlError: parsed.crawlStatus === "short_content" ? `Content shorter than ${MIN_CONTENT_LENGTH} characters` : null,
      lastCrawledAt: new Date(),
    });
    if (parsed.crawlStatus === "short_content") {
      console.warn(`[crawler] short chapter: ${chapter.getDataValue("title")} (${parsed.contentText.length} chars)`);
    }
    return { status: parsed.crawlStatus === "success" ? ("updated" as const) : ("invalid" as const), chapter };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown crawl error";
    await chapter.update({
      crawlStatus: existingText.length >= MIN_CONTENT_LENGTH ? chapter.getDataValue("crawlStatus") : "failed",
      crawlError: message,
      lastCrawledAt: new Date(),
    });
    console.error(`[crawler] failed chapter ${chapter.getDataValue("title")}: ${message}`);
    throw error;
  }
}

export async function crawlStory(
  sourceUrl: string,
  options: { category?: CategoryKey; categoryGenre?: string | null; categoryHotScore?: number; crawlContent?: boolean; maxChapters?: number } = {},
) {
  const canonicalSourceUrl = absoluteUrl(sourceUrl);
  const detail = await parseStoryDetail(await fetchHtml(canonicalSourceUrl), canonicalSourceUrl);
  const title = detail.title || canonicalSourceUrl.split("/").filter(Boolean).at(-1) || "Untitled";
  const match = await findStoryForSource(canonicalSourceUrl, slugify(title));
  const slug = match.slug;
  const author = await upsertTextModel(Author, detail.authorName);
  const categoryGenre = options.categoryGenre ?? (options.category ? categoryConfig[options.category].genre : null);
  const categoryHotScore = options.categoryHotScore ?? (options.category ? categoryConfig[options.category].hotScore : 0);

  let story = match.story;
  if (!story) {
    story = await Story.create({
      title,
      slug,
      description: detail.description,
      coverUrl: detail.coverUrl,
      coverUrlHighRes: detail.coverUrlHighRes,
      status: detail.status,
      sourceUrl: canonicalSourceUrl,
      sourceName: "truyenhoan.com",
      authorId: Number(author.get("id")) || null,
      ratingAvg: detail.ratingAvg,
      ratingCount: detail.ratingCount,
      totalChapters: detail.chapters.length,
      hotScore: categoryHotScore,
      lastChapterAt: new Date(),
    });
  }

  await story.update({
    title,
    description: detail.description || story.getDataValue("description"),
    coverUrl: detail.coverUrl || story.getDataValue("coverUrl"),
    coverUrlHighRes: detail.coverUrlHighRes || story.getDataValue("coverUrlHighRes"),
    status: detail.status,
    sourceUrl: canonicalSourceUrl,
    sourceName: "truyenhoan.com",
    authorId: Number(author.get("id")),
    totalChapters: detail.chapters.length,
    hotScore: Math.max(story.getDataValue("hotScore") || 0, categoryHotScore),
    lastChapterAt: new Date(),
  });

  const genreRecords = uniqueBySlug(
    await Promise.all(
      Array.from(new Set([categoryGenre, ...detail.genres].filter(Boolean) as string[])).map((name) =>
        upsertTextModel(Genre, name),
      ),
    ),
  );
  const tagRecords = uniqueBySlug(await Promise.all(detail.tags.map((name) => upsertTextModel(Tag, name))));
  await (story as unknown as { setGenres: (records: typeof genreRecords) => Promise<void> }).setGenres(genreRecords);
  await (story as unknown as { setTags: (records: typeof tagRecords) => Promise<void> }).setTags(tagRecords);

  const stats = {
    found: detail.chapters.length,
    inserted: 0,
    metadataUpdated: 0,
    contentUpdated: 0,
    skipped: 0,
    invalid: 0,
    failed: 0,
    indexPages: detail.chapterIndexPages,
  };
  const existingChapters = await Chapter.findAll({ where: { storyId: story.id }, attributes: ["slug"] });
  const existingSlugs = new Set(existingChapters.map((chapter) => chapter.slug));
  if (detail.chapters.length) {
    await Chapter.bulkCreate(
      detail.chapters.map((detailChapter) => ({
        storyId: story.id,
        title: detailChapter.title,
        slug: detailChapter.slug,
        chapterNumber: detailChapter.chapterNumber,
        sourceUrl: detailChapter.sourceUrl,
        content: "",
        crawlStatus: "pending" as const,
        publishedAt: null,
      })),
      { updateOnDuplicate: ["title", "chapterNumber", "sourceUrl"] },
    );
  }
  stats.inserted = detail.chapters.filter((chapter) => !existingSlugs.has(chapter.slug)).length;
  stats.metadataUpdated = detail.chapters.length - stats.inserted;
  const savedModels = detail.chapters.length
    ? await Chapter.findAll({ where: { storyId: story.id, slug: { [Op.in]: detail.chapters.map((chapter) => chapter.slug) } }, order: [["chapterNumber", "ASC"], ["id", "ASC"]] })
    : [];

  const contentLimit = options.maxChapters && options.maxChapters > 0 ? options.maxChapters : savedModels.length;
  if (options.crawlContent) {
    await mapWithConcurrency(savedModels.slice(0, contentLimit), CONTENT_CRAWL_CONCURRENCY, async (chapter) => {
      try {
        const result = await refreshChapterContent(chapter);
        if (result.status === "updated") stats.contentUpdated += 1;
        else stats[result.status] += 1;
      } catch {
        stats.failed += 1;
      }
      await new Promise((resolve) => setTimeout(resolve, 80));
    });
  }

  console.log(
    `[crawler] ${title}: ${stats.found} chapters across ${stats.indexPages} index pages; ${stats.inserted} inserted, ${stats.metadataUpdated} metadata updated, ${stats.contentUpdated} content updated, ${stats.skipped} content skipped, ${stats.invalid} short, ${stats.failed} failed`,
  );
  return { story: story.get({ plain: true }), chapters: stats.found, stats };
}

function totalFromChapterText(value?: string) {
  if (!value) return 0;
  const numbers = foldVietnamese(value).match(/\d[\d.,]*/g) || [];
  return numbers.reduce((max, item) => Math.max(max, Number(item.replace(/[^0-9]/g, "")) || 0), 0);
}

function sourceId(value: string) {
  return new URL(value).pathname.match(/\.(\d+)\/?$/)?.[1] || "source";
}

async function findStoryForSource(sourceUrl: string, baseSlug: string) {
  const bySource = await Story.findOne({ where: { sourceUrl } });
  if (bySource) return { story: bySource, slug: bySource.slug };
  const bySlug = await Story.findOne({ where: { slug: baseSlug } });
  if (!bySlug || !bySlug.sourceUrl || bySlug.sourceUrl === sourceUrl) return { story: bySlug, slug: baseSlug };
  return { story: null, slug: `${baseSlug}-${sourceId(sourceUrl)}` };
}

async function upsertCatalogItem(item: CrawlStoryListItem, genre: InstanceType<typeof Genre>, hotScore: number) {
  const baseSlug = slugify(item.title);
  const author = await upsertTextModel(Author, item.authorName || "Dang cap nhat");
  const listedChapters = totalFromChapterText(item.chapterText);
  const match = await findStoryForSource(item.sourceUrl, baseSlug);
  let story = match.story;
  const slug = match.slug;
  if (!story) {
    try {
      story = await Story.create({
        title: item.title,
        slug,
        description: "",
        coverUrl: item.coverUrl || null,
        coverUrlHighRes: item.coverUrl || null,
        status: "completed",
        sourceUrl: item.sourceUrl,
        sourceName: "truyenhoan.com",
        authorId: Number(author.get("id")),
        ratingAvg: 0,
        ratingCount: 0,
        totalChapters: listedChapters,
        hotScore,
        lastChapterAt: new Date(),
      });
    } catch (error) {
      const raced = await Story.findOne({ where: { [Op.or]: [{ sourceUrl: item.sourceUrl }, { slug }] } });
      if (!raced) throw error;
      story = raced;
    }
  } else {
    await story.update({
      title: item.title,
      coverUrl: item.coverUrl || story.coverUrl,
      coverUrlHighRes: item.coverUrl || story.coverUrlHighRes,
      status: "completed",
      sourceUrl: item.sourceUrl,
      sourceName: "truyenhoan.com",
      authorId: Number(author.get("id")),
      totalChapters: Math.max(story.totalChapters || 0, listedChapters),
      hotScore: Math.max(story.hotScore || 0, hotScore),
      lastChapterAt: new Date(),
    });
  }

  const StoryGenre = sequelize.model("StoryGenre");
  await StoryGenre.findOrCreate({ where: { storyId: story.id, genreId: Number(genre.get("id")) }, defaults: { storyId: story.id, genreId: Number(genre.get("id")) } });
  return story;
}

export async function crawlGenreCatalog(category: SourceGenreCategory, options: { pages?: number; limitPerPage?: number } = {}) {
  const firstUrl = absoluteUrl(category.path);
  const firstHtml = await fetchHtml(firstUrl);
  const availablePages = paginationPageCount(firstHtml);
  const requestedPages = Number(options.pages || 0);
  const pageCount = requestedPages > 0 ? Math.min(requestedPages, availablePages) : availablePages;
  const pages = [firstHtml];
  for (let start = 2; start <= pageCount; start += CHAPTER_INDEX_CONCURRENCY) {
    const pageNumbers = Array.from({ length: Math.min(CHAPTER_INDEX_CONCURRENCY, pageCount - start + 1) }, (_, index) => start + index);
    pages.push(...(await Promise.all(pageNumbers.map((page) => fetchHtml(absoluteUrl(`${category.path}trang-${page}/`))))));
  }

  const limitPerPage = Number(options.limitPerPage || 0);
  const itemMap = new Map<string, CrawlStoryListItem>();
  pages.forEach((html, index) => {
    const pageUrl = index === 0 ? firstUrl : absoluteUrl(`${category.path}trang-${index + 1}/`);
    const items = parseList(html, pageUrl);
    (limitPerPage > 0 ? items.slice(0, limitPerPage) : items).forEach((item) => itemMap.set(item.sourceUrl, item));
  });

  const genre = await upsertTextModel(Genre, category.name);
  const stories = await mapWithConcurrency(Array.from(itemMap.values()), CATALOG_UPSERT_CONCURRENCY, (item) => upsertCatalogItem(item, genre as InstanceType<typeof Genre>, 20));
  return { category: category.key, genre: category.name, pages: pageCount, availablePages, stories: stories.length };
}

export async function crawlAllGenreCatalog(options: { pagesPerGenre?: number; limitPerPage?: number } = {}) {
  const categories = await discoverSourceGenres();
  const results = await mapWithConcurrency(categories, STORY_CRAWL_CONCURRENCY, async (category) => {
    try {
      return await crawlGenreCatalog(category, { pages: options.pagesPerGenre, limitPerPage: options.limitPerPage });
    } catch (error) {
      console.error(`[crawler] failed catalog ${category.name}:`, error);
      return { category: category.key, genre: category.name, pages: 0, availablePages: 0, stories: 0, error: error instanceof Error ? error.message : "Unknown error" };
    }
  });
  await CrawlSource.update({ lastCrawledAt: new Date() }, { where: { name: "truyenhoan.com" } });
  return { categories: categories.length, stories: results.reduce((sum, item) => sum + item.stories, 0), results };
}

async function crawlCategoryTarget(
  config: { key: string; path: string; genre: string | null; hotScore: number },
  options: { pages?: number; limit?: number; crawlContent?: boolean; maxChaptersPerStory?: number } = {},
) {
  const firstUrl = absoluteUrl(config.path);
  const firstHtml = await fetchHtml(firstUrl);
  const availablePages = paginationPageCount(firstHtml);
  const requestedPages = Number(options.pages ?? 1);
  const pages = requestedPages <= 0 ? availablePages : Math.min(requestedPages, availablePages);
  const limit = Number(options.limit || 0);
  const results = { stories: 0, chapters: 0, failedStories: 0, category: config.key, pages, availablePages };

  await CrawlSource.findOrCreate({
    where: { name: "truyenhoan.com" },
    defaults: { name: "truyenhoan.com", baseUrl: SOURCE_BASE, enabled: true, config: categoryConfig as never },
  });

  for (let page = 1; page <= pages; page += 1) {
    const url = page === 1 ? firstUrl : absoluteUrl(`${config.path}trang-${page}/`);
    const html = page === 1 ? firstHtml : await fetchHtml(url);
    const foundItems = parseList(html, url);
    const items = limit > 0 ? foundItems.slice(0, limit) : foundItems;
    await mapWithConcurrency(items, STORY_CRAWL_CONCURRENCY, async (item) => {
      try {
        const result = await crawlStory(item.sourceUrl, {
          categoryGenre: config.genre,
          categoryHotScore: config.hotScore,
          crawlContent: options.crawlContent ?? false,
          maxChapters: options.maxChaptersPerStory,
        });
        results.stories += 1;
        results.chapters += result.chapters;
      } catch (error) {
        results.failedStories += 1;
        console.error(`[crawler] failed story ${item.title}:`, error);
      }
    });
  }

  await CrawlSource.update({ lastCrawledAt: new Date() }, { where: { name: "truyenhoan.com" } });
  return results;
}

export async function crawlCategory(
  category: CategoryKey = "hot",
  options: { pages?: number; limit?: number; crawlContent?: boolean; maxChaptersPerStory?: number } = {},
) {
  const config = categoryConfig[category];
  return crawlCategoryTarget({ key: category, ...config }, options);
}

export async function crawlSourceGenre(category: SourceGenreCategory, options: { pages?: number; limit?: number; crawlContent?: boolean; maxChaptersPerStory?: number } = {}) {
  return crawlCategoryTarget({ key: category.key, path: category.path, genre: category.name, hotScore: 30 }, options);
}

export async function crawlAllDefault() {
  return crawlAllGenreCatalog();
}

export async function ensureStoryChapterMetadata(storySlug: string) {
  const story = await Story.findOne({ where: { slug: storySlug }, attributes: ["id", "slug", "sourceUrl", "totalChapters"] });
  if (!story?.sourceUrl) return { status: "unavailable" as const, chapters: 0 };
  const savedChapters = await Chapter.count({ where: { storyId: story.id } });
  if (savedChapters > 0 && savedChapters >= story.totalChapters) return { status: "complete" as const, chapters: savedChapters };
  const result = await crawlStory(story.sourceUrl, { crawlContent: false });
  return { status: "updated" as const, chapters: result.chapters };
}

export async function verifyCrawlerData() {
  const chapters = await Chapter.findAll({
    where: { [Op.or]: [{ contentText: { [Op.is]: null } }, { wordCount: { [Op.lt]: 80 } }, { crawlStatus: { [Op.in]: ["short_content", "failed"] } }] },
    include: [{ model: Story, as: "story", attributes: ["id", "title", "slug"] }],
    order: [["storyId", "ASC"], ["chapterNumber", "ASC"]],
  });
  const missingTitle = await Chapter.count({ where: { title: "" } });
  const orphaned = await Chapter.count({ include: [{ model: Story, as: "story", required: false }], where: { "$story.id$": { [Op.is]: null } } });
  const empty = await Chapter.count({ where: { [Op.or]: [{ contentText: { [Op.is]: null } }, { contentText: "" }] } });
  const short = await Chapter.count({ where: { crawlStatus: "short_content" } });
  const failed = await Chapter.count({ where: { crawlStatus: "failed" } });
  const success = await Chapter.count({ where: { crawlStatus: "success" } });
  const summary = {
    checkedAt: new Date().toISOString(),
    invalidOrUncrawled: chapters.length,
    success,
    empty,
    short,
    failed,
    missingTitle,
    orphaned,
    sample: chapters.slice(0, 30).map((chapter) => ({
      id: chapter.id,
      title: chapter.getDataValue("title"),
      wordCount: chapter.getDataValue("wordCount"),
      crawlStatus: chapter.getDataValue("crawlStatus"),
      error: chapter.getDataValue("crawlError"),
    })),
  };
  return summary;
}
