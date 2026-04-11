import { Resvg } from "@resvg/resvg-js";

export function svgToPng(svg: string, width: number): Uint8Array {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
  });

  return resvg.render().asPng();
}
