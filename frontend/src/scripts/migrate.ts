import { sequelize } from "@/lib/sequelize";
import "@/models";
import { DataTypes } from "sequelize";

async function addColumnIfMissing(table: string, column: string, definition: Parameters<ReturnType<typeof sequelize.getQueryInterface>["addColumn"]>[2]) {
  const queryInterface = sequelize.getQueryInterface();
  const columns = await queryInterface.describeTable(table);
  if (!columns[column]) {
    await queryInterface.addColumn(table, column, definition);
    console.log(`Added ${table}.${column}`);
  }
}

async function tableExists(table: string) {
  const tables = await sequelize.getQueryInterface().showAllTables();
  return tables.some((existing) => String(existing).toLowerCase() === table.toLowerCase());
}

async function main() {
  await sequelize.authenticate();

  if (await tableExists("Users")) {
    await addColumnIfMissing("Users", "authProvider", { type: DataTypes.STRING(16), allowNull: false, defaultValue: "local" });
    await addColumnIfMissing("Users", "googleId", { type: DataTypes.STRING, allowNull: true });
    await addColumnIfMissing("Users", "emailVerified", { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false });
  }

  await sequelize.sync();

  await addColumnIfMissing("Stories", "coverUrlHighRes", { type: DataTypes.STRING, allowNull: true });
  await addColumnIfMissing("Chapters", "contentHtml", { type: DataTypes.TEXT, allowNull: true });
  await addColumnIfMissing("Chapters", "contentText", { type: DataTypes.TEXT, allowNull: true });
  await addColumnIfMissing("Chapters", "wordCount", { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 });
  await addColumnIfMissing("Chapters", "crawlStatus", { type: DataTypes.STRING(32), allowNull: false, defaultValue: "pending" });
  await addColumnIfMissing("Chapters", "crawlError", { type: DataTypes.TEXT, allowNull: true });
  await addColumnIfMissing("Chapters", "lastCrawledAt", { type: DataTypes.DATE, allowNull: true });

  await sequelize.query('CREATE EXTENSION IF NOT EXISTS pg_trgm');
  await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS stories_source_url_uq ON "Stories" ("sourceUrl") WHERE "sourceUrl" IS NOT NULL');
  await sequelize.query('CREATE INDEX IF NOT EXISTS stories_hot_updated_idx ON "Stories" ("hotScore" DESC, "lastChapterAt" DESC)');
  await sequelize.query('CREATE INDEX IF NOT EXISTS stories_status_updated_idx ON "Stories" (status, "lastChapterAt" DESC)');
  await sequelize.query('CREATE INDEX IF NOT EXISTS stories_title_trgm_idx ON "Stories" USING gin (title gin_trgm_ops)');
  await sequelize.query('CREATE INDEX IF NOT EXISTS chapters_story_number_idx ON "Chapters" ("storyId", "chapterNumber", id)');
  await sequelize.query('CREATE INDEX IF NOT EXISTS chapters_crawl_queue_idx ON "Chapters" ("crawlStatus", "lastCrawledAt")');
  await sequelize.query('CREATE INDEX IF NOT EXISTS chapters_story_status_idx ON "Chapters" ("storyId", "crawlStatus")');
  await sequelize.query('CREATE INDEX IF NOT EXISTS story_genre_lookup_idx ON "StoryGenre" ("genreId", "storyId")');
  await sequelize.query('CREATE INDEX IF NOT EXISTS comments_story_created_idx ON "Comments" ("storyId", "createdAt" DESC)');

  console.log("Database migration and performance indexes completed without destructive changes.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await sequelize.close();
  });
