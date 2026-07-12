import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({
  eyebrow,
  title,
  href,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="section-header">
      <div>
        {eyebrow ? <span>{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      {href ? (
        <Link href={href} className="section-link">
          Xem tat ca <ArrowRight size={16} />
        </Link>
      ) : null}
    </div>
  );
}
