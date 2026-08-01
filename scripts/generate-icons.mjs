import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/** Ícone: fundo preto + anéis da marca circular + monograma VC. */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0a0a0a"/>
  <circle cx="256" cy="256" r="212" fill="none" stroke="#ffffff" stroke-opacity="0.92" stroke-width="18"/>
  <circle cx="256" cy="256" r="182" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="6"/>
  <circle cx="256" cy="256" r="140" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="14"
          stroke-linecap="round" stroke-dasharray="96 40" transform="rotate(-35 256 256)"/>
  <text x="256" y="256" fill="#ffffff" font-family="Segoe UI, Helvetica, Arial, sans-serif"
        font-size="132" font-weight="600" letter-spacing="10"
        text-anchor="middle" dominant-baseline="central">VC</text>
</svg>`;

const outputs = [
  { file: path.join("app", "icon.png"), size: 192 },
  { file: path.join("app", "apple-icon.png"), size: 180 },
];

for (const { file, size } of outputs) {
  const buffer = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  await writeFile(file, buffer);
  console.log(`gerado ${file} (${size}x${size})`);
}
