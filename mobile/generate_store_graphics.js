const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32
function makeCrcTable() {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
}
const crcTable = makeCrcTable();
function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function createPng(width, height, colorFn) {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = createChunk('IHDR', ihdr);

  const rowSize = 1 + width * 4;
  const scanlines = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    scanlines[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = colorFn(x, y, width, height);
      scanlines[pixelOffset] = r;
      scanlines[pixelOffset + 1] = g;
      scanlines[pixelOffset + 2] = b;
      scanlines[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(scanlines);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const playStoreDir = path.join(__dirname, 'store_assets', 'play_store');
const appStoreDir = path.join(__dirname, 'store_assets', 'app_store');
if (!fs.existsSync(playStoreDir)) fs.mkdirSync(playStoreDir, { recursive: true });
if (!fs.existsSync(appStoreDir)) fs.mkdirSync(appStoreDir, { recursive: true });

// 1. Google Play Feature Graphic (1024x500)
const featureGraphicPng = createPng(1024, 500, (x, y, w, h) => {
  const cx = w * 0.3;
  const cy = h * 0.5;
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  if (dist < 140) {
    const factor = (x + y) / (w + h);
    return [
      Math.round(124 * (1 - factor) + 6 * factor),
      Math.round(58 * (1 - factor) + 182 * factor),
      Math.round(237 * (1 - factor) + 212 * factor),
      255,
    ];
  }
  // Deep dark glass gradient #060811 to #0F172A
  const grad = x / w;
  return [
    Math.round(6 * (1 - grad) + 15 * grad),
    Math.round(8 * (1 - grad) + 23 * grad),
    Math.round(17 * (1 - grad) + 42 * grad),
    255,
  ];
});
fs.writeFileSync(path.join(playStoreDir, 'feature_graphic_1024x500.png'), featureGraphicPng);

// 2. Play Store High-Res Icon (512x512)
const storeIconPng = createPng(512, 512, (x, y, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  const maxR = w * 0.44;
  if (dist < maxR) {
    const factor = (x + y) / (w + h);
    return [
      Math.round(124 * (1 - factor) + 6 * factor),
      Math.round(58 * (1 - factor) + 182 * factor),
      Math.round(237 * (1 - factor) + 212 * factor),
      255,
    ];
  }
  return [6, 8, 17, 255];
});
fs.writeFileSync(path.join(playStoreDir, 'icon_512x512.png'), storeIconPng);
fs.writeFileSync(path.join(appStoreDir, 'app_icon_1024x1024.png'), storeIconPng);

console.log('Store graphics successfully generated in store_assets/');
