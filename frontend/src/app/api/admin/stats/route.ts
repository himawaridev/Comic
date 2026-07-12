import { fail, ok } from "@/lib/response";
import { readSession } from "@/lib/auth";
import { Chapter, Comment, CrawlSource, Rating, Story, User } from "@/models";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const user = await readSession();
  if (!user || user.role !== "admin") return fail("Forbidden", 403);
  const [stories, chapters, users, comments, ratings, sources] = await Promise.all([Story.count(), Chapter.count(), User.count(), Comment.count(), Rating.count(), CrawlSource.count({ where: { enabled: true } })]);
  return ok({ stories, chapters, users, comments, ratings, sources });
}
