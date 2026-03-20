/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { fontData as astroFontData } from "astro:assets";
import satori from "satori";

import { CONFIG } from "../config";

type OgImageType = "page" | "post";

interface OgImageProps {
  title: string;
  description?: string;
}

const websiteHost = new URL(CONFIG.website).host;

function DefaultOgImage({ title, description }: OgImageProps) {
  return (
    <div
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        backgroundColor: "#18181b",
        padding: "0",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Google Sans Code",
        position: "relative",
      }}
    >
      {/* Corner accents */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "80px",
          height: "4px",
          backgroundColor: "#22c55e",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "4px",
          height: "80px",
          backgroundColor: "#22c55e",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "0",
          right: "0",
          width: "80px",
          height: "4px",
          backgroundColor: "#22c55e",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "0",
          right: "0",
          width: "4px",
          height: "80px",
          backgroundColor: "#22c55e",
          display: "flex",
        }}
      />

      {/* Center content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <div
          style={{
            color: "#22c55e",
            fontSize: "96px",
            fontWeight: 700,
            letterSpacing: "-2px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#71717a",
            fontSize: "28px",
            letterSpacing: "1px",
          }}
        >
          {description}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "2px",
              backgroundColor: "#3f3f46",
              display: "flex",
            }}
          />
          <div style={{ color: "#52525b", fontSize: "22px" }}>
            {websiteHost}
          </div>
          <div
            style={{
              width: "32px",
              height: "2px",
              backgroundColor: "#3f3f46",
              display: "flex",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function PostOgImage({ title, description }: OgImageProps) {
  return (
    <div
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        backgroundColor: "#18181b",
        border: "2px solid #15803d",
        padding: "60px",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Google Sans Code",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ color: "#22c55e", fontSize: "28px", fontWeight: 600 }}>
          {CONFIG.title}
        </div>
        <div
          style={{
            color: "#22c55e",
            fontSize: "22px",
            fontWeight: 600,
            border: "1px solid #22c55e",
            padding: "4px 14px",
          }}
        >
          blog post
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            color: "#f4f4f5",
            fontSize: title.length > 40 ? "52px" : "64px",
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              color: "#a1a1aa",
              fontSize: "28px",
              lineHeight: 1.4,
              maxWidth: "900px",
            }}
          >
            {description}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{ width: "40px", height: "4px", backgroundColor: "#22c55e" }}
        />
        <div style={{ color: "#71717a", fontSize: "24px" }}>{websiteHost}</div>
      </div>
    </div>
  );
}

async function loadFontData(): Promise<ArrayBuffer> {
  const fonts = astroFontData["--font-google-sans-code"];
  // satori does not support WOFF2; "truetype" = TTF in CSS terms

  const WEIGHT = "400";
  const STYLE = "normal";
  const FORMAT = "truetype";

  const variant = fonts.find(
    (f) =>
      f.weight === WEIGHT && f.style === STYLE && f.src[0]?.format === FORMAT,
  );

  if (!variant) {
    throw new Error(
      `Could not find Google Sans Code font variant: weight=${WEIGHT}, style=${STYLE}, format=${FORMAT}.`,
    );
  }

  const fontRelPath = variant.src[0].url.replace(/^\//, "");
  const fontPath = resolve("dist", fontRelPath);
  return (await readFile(fontPath)).buffer as ArrayBuffer;
}

function svgToPng(svg: string): Uint8Array {
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  return resvg.render().asPng();
}

export async function generateOgImage(
  title: string,
  description?: string,
  type?: OgImageType,
): Promise<Uint8Array> {
  const fontData = await loadFontData();

  const element =
    type === "post" ? (
      <PostOgImage title={title} description={description} />
    ) : (
      <DefaultOgImage title={title} description={description} />
    );

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Google Sans Code",
        data: fontData,
        weight: 400,
        style: "normal",
      },
    ],
  });

  return svgToPng(svg);
}
