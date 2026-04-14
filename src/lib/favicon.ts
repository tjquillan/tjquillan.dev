import faviconSvg from "../../public/favicon.svg?raw";
import { svgToPng } from "./svg";

// https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
const FAVICON_ICO_SIZES = [32];
const APPLE_TOUCH_ICON_SIZE = 180;

export const FAVICON_ICO_SIZES_STR = FAVICON_ICO_SIZES.map(
  (val) => `${val}x${val}`,
).join(" ");

function createIco(images: Array<{ size: number; data: Buffer }>) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(images.length * 16);
  let offset = header.length + directory.length;

  images.forEach(({ size, data }, index) => {
    const entryOffset = index * 16;

    directory.writeUInt8(size === 256 ? 0 : size, entryOffset);
    directory.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    directory.writeUInt8(0, entryOffset + 2);
    directory.writeUInt8(0, entryOffset + 3);
    directory.writeUInt16LE(1, entryOffset + 4);
    directory.writeUInt16LE(32, entryOffset + 6);
    directory.writeUInt32LE(data.length, entryOffset + 8);
    directory.writeUInt32LE(offset, entryOffset + 12);

    offset += data.length;
  });

  return Buffer.concat([header, directory, ...images.map(({ data }) => data)]);
}

export async function generateFaviconIco() {
  const images = FAVICON_ICO_SIZES.map((size) => ({
    size,
    data: Buffer.from(svgToPng(faviconSvg, size)),
  }));

  return createIco(images);
}

export async function generateAppleTouchIcon() {
  return svgToPng(faviconSvg, APPLE_TOUCH_ICON_SIZE);
}
