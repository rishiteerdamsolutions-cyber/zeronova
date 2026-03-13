const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [192, 512];
const outDir = path.join(__dirname, "..", "public", "icons");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#16a34a"/>
  <text x="256" y="280" font-size="200" text-anchor="middle" fill="white" font-family="sans-serif">Z</text>
</svg>
`;

Promise.all(
  sizes.map((size) =>
    sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon-${size}.png`))
  )
).then(() => console.log("Icons generated")).catch(console.error);
