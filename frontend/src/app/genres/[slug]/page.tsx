import ComicListPage from "@/components/story/ComicListPage";

export const dynamic = "force-dynamic";

export default function GenreDetailPage({ params, searchParams }: { params: { slug: string }; searchParams: { page?: string } }) {
  const title = params.slug.replaceAll("-", " ");
  return <ComicListPage title={`The loai ${title}`} collection="hot" genre={params.slug} page={Math.max(1, Number(searchParams.page || 1))} />;
}
