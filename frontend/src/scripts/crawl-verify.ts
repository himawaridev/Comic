import { sequelize } from "@/lib/sequelize";
import "@/models";
import { verifyCrawlerData } from "@/services/crawler.service";

async function main() {
  await sequelize.authenticate();
  const summary = await verifyCrawlerData();
  console.log(JSON.stringify(summary, null, 2));
  if (summary.missingTitle > 0 || summary.orphaned > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
