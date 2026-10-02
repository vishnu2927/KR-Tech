const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 implementation
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

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // Scanlines with filter 0
  const rowSize = 1 + width * 4;
  const scanlines = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    scanlines[rowOffset] = 0; // No filter
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

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. App Icon (512x512) - Rich dark purple/cyan glowing badge
const iconPng = createPng(512, 512, (x, y, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  const maxR = w * 0.44;

  if (dist < maxR) {
    // Purple to cyan gradient inside rounded circle
    const factor = (x + y) / (w + h);
    const r = Math.round(124 * (1 - factor) + 6 * factor);
    const g = Math.round(58 * (1 - factor) + 182 * factor);
    const b = Math.round(237 * (1 - factor) + 212 * factor);
    return [r, g, b, 255];
  } else {
    // Dark background #060811
    return [6, 8, 17, 255];
  }
});
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconPng);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), iconPng);

// 2. Splash Screen (400x800) - Dark glass with glowing center
const splashPng = createPng(400, 800, (x, y, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  if (dist < 80) {
    const factor = (x + y) / (w + h);
    return [
      Math.round(124 * (1 - factor) + 0),
      Math.round(58 * (1 - factor) + 245 * factor),
      Math.round(237 * (1 - factor) + 255 * factor),
      255
    ];
  }
  return [6, 8, 17, 255]; // Dark background #060811
});
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splashPng);

// 3. Favicon (48x48)
const faviconPng = createPng(48, 48, (x, y, w, h) => {
  const factor = (x + y) / (w + h);
  return [
    Math.round(124 * (1 - factor) + 6 * factor),
    Math.round(58 * (1 - factor) + 182 * factor),
    Math.round(237 * (1 - factor) + 212 * factor),
    255
  ];
});
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), faviconPng);

console.log('Mobile assets successfully generated in', assetsDir);
