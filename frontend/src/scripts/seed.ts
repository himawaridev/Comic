import { sequelize } from "@/lib/sequelize";
import { hashPassword } from "@/lib/auth";
import { Genre, User } from "@/models";
import { slugify } from "@/lib/slug";

const genres = ["Tien hiep", "Kiem hiep", "Ngon tinh", "Do thi", "Huyen huyen", "Quan truong"];

async function main() {
  await sequelize.authenticate();

  const passwordHash = await hashPassword("admin123456");
  const [admin] = await User.findOrCreate({
    where: { email: "admin@example.com" },
    defaults: {
      name: "Admin",
      email: "admin@example.com",
      passwordHash,
      role: "admin",
    },
  });

  await admin.update({ role: "admin", passwordHash });
  await admin.update({ authProvider: "local", emailVerified: true });

  for (const name of genres) {
    await Genre.findOrCreate({
      where: { slug: slugify(name) },
      defaults: { name, slug: slugify(name) } as any,
    });
  }

  console.log("Seed completed: admin@example.com / admin123456 and base genres.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await sequelize.close();
  });
