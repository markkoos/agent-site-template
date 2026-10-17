"use client";

import { useState, type ImgHTMLAttributes } from "react";

/**
 * <img> that swaps to a local placeholder if the remote photo fails
 * (expired MLS photo URL, removed CDN image…). Lazy by default.
 */
export function SafeImg({
  src,
  fallback = "/placeholder-home.svg",
  loading = "lazy",
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { src?: string; fallback?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      {...rest}
      src={failed || !src ? fallback : src}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
