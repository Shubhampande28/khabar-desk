import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

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
          backgroundColor: "#14171C"
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontStyle: "italic",
            fontWeight: 600,
            color: "#F1EEE6"
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 20,
            color: "#F1EEE6",
            opacity: 0.6,
            letterSpacing: 4,
            textTransform: "uppercase"
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 60 }}>
          {["#C0392B", "#C98A2C", "#B0456E", "#2F6F6B", "#2B4570"].map((c) => (
            <div
              key={c}
              style={{
                width: 22,
                height: 22,
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
