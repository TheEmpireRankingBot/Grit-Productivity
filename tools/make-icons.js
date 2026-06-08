// Generates the app icons (PNG) with no native dependencies — pure Node zlib.
// Re-run with `node tools/make-icons.js` if the icon design changes.
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (~c) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePng(S, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(S, 0); ihdr.writeUInt32BE(S, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit, RGBA
  const stride = S * 4;
  const raw = Buffer.alloc((stride + 1) * S);
  for (let y = 0; y < S; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}
function draw(S) {
  const rgba = Buffer.alloc(S * S * 4);
  const bg = [2, 6, 23], amber = [245, 158, 11], slate = [71, 85, 105];
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const i = (y * S + x) * 4; rgba[i] = bg[0]; rgba[i + 1] = bg[1]; rgba[i + 2] = bg[2]; rgba[i + 3] = 255;
  }
  const blend = (x, y, c, a) => {
    if (x < 0 || y < 0 || x >= S || y >= S || a <= 0) return;
    const i = (y * S + x) * 4; const ia = Math.min(1, a);
    rgba[i] = Math.round(rgba[i] * (1 - ia) + c[0] * ia);
    rgba[i + 1] = Math.round(rgba[i + 1] * (1 - ia) + c[1] * ia);
    rgba[i + 2] = Math.round(rgba[i + 2] * (1 - ia) + c[2] * ia);
  };
  // sun
  const cx = S * 0.5, cy = S * 0.6, r = S * 0.16;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
    blend(x, y, amber, r - Math.sqrt(dx * dx + dy * dy) + 0.5);
  }
  // horizon lines
  const line = (yc, x0, x1, th, c) => {
    for (let y = Math.floor(yc - th); y <= Math.ceil(yc + th); y++) {
      const cov = (th / 2) - Math.abs(y - yc) + 0.5;
      for (let x = Math.round(x0); x <= Math.round(x1); x++) blend(x, y, c, cov);
    }
  };
  line(S * 0.70, S * 0.14, S * 0.86, S * 0.045, amber);
  line(S * 0.80, S * 0.24, S * 0.76, S * 0.028, slate);
  return rgba;
}

const out = path.basename(__dirname) === 'tools' ? path.join(__dirname, '..') : __dirname;
[[192, 'icon-192.png'], [512, 'icon-512.png'], [180, 'apple-touch-icon.png']].forEach(([S, name]) => {
  fs.writeFileSync(path.join(out, name), encodePng(S, draw(S)));
  console.log('wrote', name, '(' + S + 'x' + S + ')');
});
