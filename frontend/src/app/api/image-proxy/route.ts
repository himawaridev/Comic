import { fail } from "@/lib/response";
import { isAllowedSourceImage } from "@/lib/images";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url") || "";
  if (!isAllowedSourceImage(url)) return fail("Image host is not allowed", 400);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        referer: "https://truyenhoan.com/",
        "user-agent": "Mozilla/5.0 (compatible; TruyenHoanImageProxy/1.0)",
      },
    });
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.startsWith("image/")) return fail("Source image is unavailable", 502);

    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > 8 * 1024 * 1024) return fail("Source image is too large", 413);
    return new Response(bytes, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return fail("Cannot fetch source image", 502);
  }
}
