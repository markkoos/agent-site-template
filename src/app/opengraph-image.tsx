import { ImageResponse } from "next/og";
import { site } from "@/site.config";

// Default social share image (pages with listing photos use those instead).
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
          justifyContent: "flex-end",
          padding: 72,
          background: "linear-gradient(135deg, #1f5f74 0%, #2c7f8f 60%, #e0b48a 140%)",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, opacity: 0.85, marginBottom: 12 }}>
          {`${site.agent.name} · ${site.agent.jobTitle}`}
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>{site.brand.siteName}</div>
        <div style={{ display: "flex", fontSize: 34, marginTop: 16, opacity: 0.92 }}>{site.brand.tagline}</div>
      </div>
    ),
    size,
  );
}
