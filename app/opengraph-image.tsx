import { ImageResponse } from "next/og";
import { portfolioPalette as palette, portfolioTheme } from "@/data/palette";

export const alt =
  "Nur Mohammad - Backend Developer portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const gridLines = Array.from({ length: 9 }, (_, index) => index);

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          overflow: "hidden",
          background: palette.ink,
          color: palette.text,
          fontFamily: "sans-serif",
          padding: "58px 64px",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 470,
            height: 470,
            right: -150,
            top: -190,
            display: "flex",
            borderRadius: 999,
            background:
              `radial-gradient(circle, rgba(${portfolioTheme["--signal-rgb"]},0.22) 0%, rgba(${portfolioTheme["--signal-deep-rgb"]},0.1) 42%, rgba(${portfolioTheme["--ink-rgb"]},0) 70%)`,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.15,
          }}
        >
          {gridLines.map((line) => (
            <div
              key={line}
              style={{
                position: "absolute",
                left: 64 + line * 134,
                top: 0,
                width: 1,
                height: "100%",
                display: "flex",
                background: palette.mutedLight,
              }}
            />
          ))}
        </div>

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            borderTop: `1px solid rgba(${portfolioTheme["--text-rgb"]},0.24)`,
            borderBottom: `1px solid rgba(${portfolioTheme["--text-rgb"]},0.24)`,
            padding: "28px 0 30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 25,
                fontWeight: 700,
                letterSpacing: "-0.04em",
              }}
            >
              NM<span style={{ color: palette.signal }}>.</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: palette.muted,
                fontSize: 15,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  display: "flex",
                  borderRadius: 99,
                  background: palette.signal,
                }}
              />
              Available for selected projects
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                color: palette.signal,
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 15,
              }}
            >
              Backend · mobile · APIs · production
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 910,
                fontSize: 82,
                lineHeight: 0.95,
                fontWeight: 650,
                letterSpacing: "-0.065em",
              }}
            >
              Nur Mohammad
            </div>
            <div
              style={{
                display: "flex",
                color: palette.muted,
                fontSize: 31,
                lineHeight: 1.2,
                letterSpacing: "-0.025em",
                marginTop: 20,
              }}
            >
              Backend Developer · AI-Assisted Frontend
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: palette.muted,
              fontSize: 15,
              letterSpacing: "0.04em",
            }}
          >
            <div style={{ display: "flex", gap: 18 }}>
              <span>APIs</span>
              <span>·</span>
              <span>MOBILE</span>
              <span>·</span>
              <span>BACKEND</span>
              <span>·</span>
              <span>DEPLOYMENT</span>
            </div>
            <div style={{ display: "flex" }}>nurmohammad.dev</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
