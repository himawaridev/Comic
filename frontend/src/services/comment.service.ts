import { Comment, Story, User } from "@/models";

export type CommentDto = {
  id: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  createdLabel: string;
  user: { id: number; name: string; avatarUrl: string | null; role: "user" | "admin" };
};

const includeUser = { model: User, as: "user", attributes: ["id", "name", "avatarUrl", "role"] };

export function toCommentDto(comment: InstanceType<typeof Comment>): CommentDto {
  const raw = comment.get({ plain: true }) as Record<string, any>;
  const createdAt = new Date(raw.createdAt);
  return {
    id: String(raw.id),
    content: String(raw.content),
    isEdited: Boolean(raw.isEdited),
    createdAt: createdAt.toISOString(),
    createdLabel: createdAt.toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bangkok" }),
    user: {
      id: Number(raw.user.id),
      name: String(raw.user.name),
      avatarUrl: raw.user.avatarUrl || null,
      role: raw.user.role,
    },
  };
}

export async function listStoryComments(storySlug: string, limit = 100) {
  const story = await Story.findOne({ where: { slug: storySlug }, attributes: ["id"] });
  if (!story) return null;
  const comments = await Comment.findAll({ where: { storyId: story.id }, include: [includeUser], order: [["createdAt", "DESC"]], limit });
  return comments.map(toCommentDto);
}

export async function findCommentWithUser(commentId: number) {
  const comment = await Comment.findByPk(commentId, { include: [includeUser] });
  return comment ? toCommentDto(comment) : null;
}
