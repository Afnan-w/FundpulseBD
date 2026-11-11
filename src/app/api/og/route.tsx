// @ts-ignore - Next.js 16 route config compatibility
// @ts-nocheck
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          boxSizing: "border-box",
        }}
      >
        <div style={{
          fontSize: 64,
          fontWeight: "bold",
          marginBottom: 16,
          textAlign: "center",
        }}>
          FundpulseBD
        </div>
        <div style={{
          fontSize: 32,
          textAlign: "center",
          opacity: 0.9,
        }}>
          Savings and fund news for Bangladesh
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}