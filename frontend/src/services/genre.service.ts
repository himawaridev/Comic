import { col, fn } from "sequelize";
import { Genre, Story } from "@/models";

export async function listGenresWithCounts() {
  const rows = await Genre.findAll({
    attributes: ["id", "name", "slug", [fn("COUNT", col("stories.id")), "storyCount"]],
    include: [{ model: Story, as: "stories", attributes: [], through: { attributes: [] }, required: false }],
    group: ["Genre.id"],
    order: [["name", "ASC"]],
    subQuery: false,
  });
  return rows
    .map((row) => ({
      id: Number(row.get("id")),
      name: String(row.get("name")),
      slug: String(row.get("slug")),
      storyCount: Number(row.get("storyCount") || 0),
    }))
    .filter((genre) => genre.storyCount > 0);
}
