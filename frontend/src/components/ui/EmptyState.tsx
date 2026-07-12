import Link from "next/link";
import { DatabaseZap } from "lucide-react";

export default function EmptyState({
  title = "Chua co du lieu truyen",
  description = "Hay chay db:migrate, db:seed va crawl de nap du lieu that tu crawler vao database.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="empty-state soft-card">
      <DatabaseZap size={30} />
      <h2>{title}</h2>
      <p>{description}</p>
      <code>npm run db:migrate && npm run db:seed && npm run crawl</code>
      <Link className="btn btn-primary" href="/genres">
        Xem the loai
      </Link>
    </div>
  );
}
