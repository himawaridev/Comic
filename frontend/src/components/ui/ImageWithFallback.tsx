"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

export default function ImageWithFallback({ src, alt, ...props }: ImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => setCurrentSrc(src), [src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      unoptimized={typeof currentSrc === "string" && currentSrc.startsWith("/api/image-proxy")}
      onError={() => setCurrentSrc("/cover-fallback.svg")}
    />
  );
}
