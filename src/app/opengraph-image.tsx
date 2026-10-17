import { ImageResponse } from "next/og";
import { site } from "@/site.config";

// Default social share image (pages with listing photos use those instead).
// Colors approximate the editorial theme (ink, cream, brass) — adjust per client.
export const alt = site.brand.siteName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#f8f4ec",
          color: "#22272f",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#6b7280" }}>
          {site.serviceAreas.join(" · ")}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, lineHeight: 1.05 }}>{site.brand.siteName}</div>
          <div style={{ display: "flex", fontSize: 40, marginTop: 20, color: "#a07a3c", fontStyle: "italic" }}>
            {site.brand.tagline}
          </div>
        </div>
        <div style={{ display: "flex", height: 4, width: 160, background: "#c0954f" }} />
      </div>
    ),
    size,
  );
}
