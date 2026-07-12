const SOURCE_IMAGE_HOSTS = ["truyenhoan.com", "cdn.truyenhoan.com"];

export function isAllowedSourceImage(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && SOURCE_IMAGE_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

export function proxiedImageUrl(value?: string | null) {
  if (!value) return "/cover-fallback.svg";
  if (value.startsWith("/")) return value;
  return isAllowedSourceImage(value) ? `/api/image-proxy?url=${encodeURIComponent(value)}` : "/cover-fallback.svg";
}
