import { readSession } from "@/lib/auth";
import EmptyState from "@/components/ui/EmptyState";
import CrawlerPanel from "./panel";

export const dynamic = "force-dynamic";

export default async function AdminCrawlerPage() {
  const user = await readSession();
  if (!user || user.role !== "admin") {
    return (
      <div className="screen-shell">
        <div className="app-container"><EmptyState title="Chi admin moi vao duoc" /></div>
      </div>
    );
  }

  return <CrawlerPanel />;
}
