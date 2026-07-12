import { redirect } from "next/navigation";

export default function LegacyHotDetail({ params }: { params: { id: string[] } }) {
  redirect(`/stories/${params.id.at(-1) || "solo-leveling"}`);
}
