import { sequelize } from "@/lib/sequelize";
import "@/models";
import { crawlAllDefault, crawlAllGenreCatalog, crawlCategory, crawlGenreCatalog, crawlStory, discoverSourceGenres } from "@/services/crawler.service";

async function main() {
  await sequelize.authenticate();

  const args = process.argv.slice(2);
  if (args.includes("--catalog")) {
    const categoryKey = process.env.CRAWL_CATEGORY;
    const options = { pages: Number(process.env.CRAWL_PAGES || 0), limitPerPage: Number(process.env.CRAWL_LIMIT || 0) };
    const category = categoryKey ? (await discoverSourceGenres()).find((item) => item.key === categoryKey) : null;
    if (categoryKey && !category) throw new Error(`Source category not found: ${categoryKey}`);
    const result = category
      ? await crawlGenreCatalog(category, options)
      : await crawlAllGenreCatalog({ pagesPerGenre: options.pages, limitPerPage: options.limitPerPage });
    console.log("Crawled source catalog:", result);
    return;
  }

  const storyFlagIndex = args.indexOf("--story");
  if (storyFlagIndex >= 0) {
    const url = args[storyFlagIndex + 1];
    if (!url) throw new Error("Missing story URL. Usage: npm run crawl:story -- https://truyenhoan.com/... ");
    const result = await crawlStory(url, {
      crawlContent: true,
      maxChapters: process.env.CRAWL_MAX_CHAPTERS ? Number(process.env.CRAWL_MAX_CHAPTERS) : undefined,
    });
    console.log("Crawled story:", result);
    return;
  }

  const category = (process.env.CRAWL_CATEGORY || args[0]) as Parameters<typeof crawlCategory>[0] | undefined;
  if (category) {
    const result = await crawlCategory(category, {
      pages: Number(process.env.CRAWL_PAGES || 1),
      limit: Number(process.env.CRAWL_LIMIT || 0),
      crawlContent: process.env.CRAWL_CONTENT === "true",
      maxChaptersPerStory: process.env.CRAWL_MAX_CHAPTERS ? Number(process.env.CRAWL_MAX_CHAPTERS) : undefined,
    });
    console.log("Crawled category:", result);
    return;
  }

  const result = await crawlAllDefault();
  console.log("Crawled default categories:", result);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await sequelize.close();
  });
