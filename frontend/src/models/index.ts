import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/lib/sequelize";

type Id = number;

type UserAttrs = {
  id: Id;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string | null;
  role: "user" | "admin";
  authProvider: "local" | "google" | "mixed";
  googleId?: string | null;
  emailVerified: boolean;
};

type CommentAttrs = {
  id: Id;
  userId: Id;
  storyId: Id;
  content: string;
  isEdited: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type StoryAttrs = {
  id: Id;
  title: string;
  slug: string;
  originalTitle?: string | null;
  description?: string | null;
  coverUrl?: string | null;
  coverUrlHighRes?: string | null;
  status: "ongoing" | "completed" | "paused";
  sourceUrl?: string | null;
  sourceName?: string | null;
  authorId?: Id | null;
  ratingAvg: number;
  ratingCount: number;
  totalChapters: number;
  viewCount: number;
  hotScore: number;
  lastChapterAt?: Date | null;
};

type ChapterAttrs = {
  id: Id;
  storyId: Id;
  title: string;
  slug: string;
  chapterNumber?: number | null;
  content: string;
  contentHtml?: string | null;
  contentText?: string | null;
  wordCount: number;
  crawlStatus: "pending" | "success" | "short_content" | "failed";
  crawlError?: string | null;
  lastCrawledAt?: Date | null;
  sourceUrl?: string | null;
  publishedAt?: Date | null;
};

class User extends Model<UserAttrs, Optional<UserAttrs, "id" | "avatarUrl" | "role" | "authProvider" | "googleId" | "emailVerified">> implements UserAttrs {
  declare id: Id;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare avatarUrl: string | null;
  declare role: "user" | "admin";
  declare authProvider: "local" | "google" | "mixed";
  declare googleId: string | null;
  declare emailVerified: boolean;
}

class Comment extends Model<CommentAttrs, Optional<CommentAttrs, "id" | "isEdited" | "createdAt" | "updatedAt">> implements CommentAttrs {
  declare id: Id;
  declare userId: Id;
  declare storyId: Id;
  declare content: string;
  declare isEdited: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

class Story extends Model<StoryAttrs, Optional<StoryAttrs, "id" | "status" | "ratingAvg" | "ratingCount" | "totalChapters" | "viewCount" | "hotScore">> implements StoryAttrs {
  declare id: Id;
  declare title: string;
  declare slug: string;
  declare originalTitle: string | null;
  declare description: string | null;
  declare coverUrl: string | null;
  declare coverUrlHighRes: string | null;
  declare status: "ongoing" | "completed" | "paused";
  declare sourceUrl: string | null;
  declare sourceName: string | null;
  declare authorId: Id | null;
  declare ratingAvg: number;
  declare ratingCount: number;
  declare totalChapters: number;
  declare viewCount: number;
  declare hotScore: number;
  declare lastChapterAt: Date | null;
}

class Chapter extends Model<
  ChapterAttrs,
  Optional<ChapterAttrs, "id" | "chapterNumber" | "content" | "contentHtml" | "contentText" | "wordCount" | "crawlStatus" | "crawlError" | "lastCrawledAt">
> implements ChapterAttrs {
  declare id: Id;
  declare storyId: Id;
  declare title: string;
  declare slug: string;
  declare chapterNumber: number | null;
  declare content: string;
  declare contentHtml: string | null;
  declare contentText: string | null;
  declare wordCount: number;
  declare crawlStatus: "pending" | "success" | "short_content" | "failed";
  declare crawlError: string | null;
  declare lastCrawledAt: Date | null;
  declare sourceUrl: string | null;
  declare publishedAt: Date | null;
}

export const Author = sequelize.define("Author", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
});

export const Genre = sequelize.define("Genre", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
});

export const Tag = sequelize.define("Tag", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
});

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.ENUM("user", "admin"), allowNull: false, defaultValue: "user" },
    authProvider: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "local" },
    googleId: { type: DataTypes.STRING, allowNull: true },
    emailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, modelName: "User", indexes: [{ unique: true, fields: ["email"] }, { unique: true, fields: ["googleId"] }] },
);

Story.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    originalTitle: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    coverUrl: { type: DataTypes.STRING, allowNull: true },
    coverUrlHighRes: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM("ongoing", "completed", "paused"), allowNull: false, defaultValue: "ongoing" },
    sourceUrl: { type: DataTypes.STRING, allowNull: true },
    sourceName: { type: DataTypes.STRING, allowNull: true },
    authorId: { type: DataTypes.INTEGER, allowNull: true },
    ratingAvg: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    ratingCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    totalChapters: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    viewCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    hotScore: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    lastChapterAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: "Story",
    indexes: [
      { unique: true, fields: ["slug"] },
      { fields: ["title"] },
      { fields: ["status"] },
      { fields: ["lastChapterAt"] },
      { fields: ["hotScore"] },
    ],
  },
);

Chapter.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    storyId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    chapterNumber: { type: DataTypes.INTEGER, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    contentHtml: { type: DataTypes.TEXT, allowNull: true },
    contentText: { type: DataTypes.TEXT, allowNull: true },
    wordCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    crawlStatus: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "pending" },
    crawlError: { type: DataTypes.TEXT, allowNull: true },
    lastCrawledAt: { type: DataTypes.DATE, allowNull: true },
    sourceUrl: { type: DataTypes.STRING, allowNull: true },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: "Chapter",
    indexes: [
      { unique: true, fields: ["storyId", "slug"] },
      { fields: ["storyId"] },
    ],
  },
);

export const Favorite = sequelize.define(
  "Favorite",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    storyId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  },
  { indexes: [{ unique: true, fields: ["userId", "storyId"] }] },
);

export const ReadingHistory = sequelize.define(
  "ReadingHistory",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    storyId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    chapterId: { type: DataTypes.INTEGER, allowNull: false },
    progressPercent: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    lastReadAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { indexes: [{ unique: true, fields: ["userId", "storyId"] }] },
);

export const Rating = sequelize.define(
  "Rating",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    storyId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    value: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 10 } },
  },
  { indexes: [{ unique: true, fields: ["userId", "storyId"] }] },
);

Comment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    storyId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false, validate: { len: [2, 2000] } },
    isEdited: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    modelName: "Comment",
    indexes: [{ fields: ["storyId", "createdAt"] }, { fields: ["userId"] }],
  },
);

export const CrawlSource = sequelize.define("CrawlSource", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  baseUrl: { type: DataTypes.STRING, allowNull: false },
  enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  lastCrawledAt: { type: DataTypes.DATE, allowNull: true },
  config: { type: DataTypes.JSONB, allowNull: true },
});

Story.belongsTo(Author, { as: "author", foreignKey: "authorId" });
Author.hasMany(Story, { as: "stories", foreignKey: "authorId" });
Story.hasMany(Chapter, { as: "chapters", foreignKey: "storyId" });
Chapter.belongsTo(Story, { as: "story", foreignKey: "storyId" });
Story.belongsToMany(Genre, { through: "StoryGenre", as: "genres", foreignKey: "storyId" });
Genre.belongsToMany(Story, { through: "StoryGenre", as: "stories", foreignKey: "genreId" });
Story.belongsToMany(Tag, { through: "StoryTag", as: "tags", foreignKey: "storyId" });
Tag.belongsToMany(Story, { through: "StoryTag", as: "stories", foreignKey: "tagId" });
User.belongsToMany(Story, { through: Favorite, as: "favoriteStories", foreignKey: "userId" });
Story.belongsToMany(User, { through: Favorite, as: "fans", foreignKey: "storyId" });
User.hasMany(Comment, { as: "comments", foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { as: "user", foreignKey: "userId" });
Story.hasMany(Comment, { as: "comments", foreignKey: "storyId", onDelete: "CASCADE" });
Comment.belongsTo(Story, { as: "story", foreignKey: "storyId" });

export { User, Story, Chapter, Comment };

export const models = {
  User,
  Story,
  Chapter,
  Author,
  Genre,
  Tag,
  Favorite,
  ReadingHistory,
  Rating,
  CrawlSource,
  Comment,
};
