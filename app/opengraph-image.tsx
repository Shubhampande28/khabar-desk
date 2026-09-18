import { ImageResponse } from "next/og";
import { SITE_TAGLINE } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F172A"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="130" height="130" viewBox="0 0 200 200">
            <path
              d="M 30 20 H 170 A 20 20 0 0 1 190 40 V 130 A 20 20 0 0 1 170 150 H 78 L 46 182 A 4 4 0 0 1 40 179 L 42 150 H 30 A 20 20 0 0 1 10 130 V 40 A 20 20 0 0 1 30 20 Z"
              fill="#F2622A"
            />
            <rect x="38" y="58" width="124" height="14" rx="7" fill="#FFFFFF" />
            <rect x="38" y="86" width="90" height="14" rx="7" fill="#FFFFFF" opacity="0.9" />
            <rect x="38" y="114" width="64" height="14" rx="7" fill="#FFFFFF" opacity="0.7" />
            <circle cx="172" cy="28" r="13" fill="#0F172A" />
            <circle cx="172" cy="28" r="6" fill="#FFFFFF" />
          </svg>
          <div style={{ display: "flex", fontSize: 100, fontWeight: 800 }}>
            <span style={{ color: "#FFFFFF" }}>Khabar</span>
            <span style={{ color: "#F2622A" }}>Adda</span>
          </div>
        </div>
        <div
          style={{
            fontSize: 30,
            marginTop: 24,
            color: "#8FA0C0",
            letterSpacing: 4,
            textTransform: "uppercase"
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 56 }}>
          {["#F2622A", "#F0A028", "#E0457B", "#1B9AAA", "#45577A", "#3B6EA5"].map((c) => (
            <div
              key={c}
              style={{
                width: 20,
                height: 20,
                borderRadius: 999,
                backgroundColor: c
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
