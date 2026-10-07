import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F172A"
        }}
      >
        <svg width="148" height="148" viewBox="0 0 200 200">
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
      </div>
    ),
    { ...size }
  );
}
