import ReaderClient from "@/components/reader/ReaderClient";
import { findStoryBySlug, getChapter } from "@/lib/comic-data";
import { notFound } from "next/navigation";
import { readSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string; chapterSlug: string } }) {
  const story = await findStoryBySlug(params.slug);
  const data = await getChapter(params.slug, params.chapterSlug);
  return {
    title: `${data?.chapter?.title || "Chuong"} - ${story?.title || "Truyen Hoan"}`,
  };
}

export default async function ChapterReaderPage({ params }: { params: { slug: string; chapterSlug: string } }) {
  const data = await getChapter(params.slug, params.chapterSlug);
  if (!data) notFound();
  const user = await readSession();

  return <ReaderClient story={data.story} chapter={data.chapter} previous={data.previousChapter} next={data.nextChapter} chapterTotal={data.chapterTotal} authenticated={Boolean(user)} />;
}
