import fetch from 'node-fetch';
import fs from 'fs';
import { parse } from 'node-html-parser';

const url = "http://www.koeri.boun.edu.tr/scripts/lst5.asp";

try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const html = await response.text();
  const root = parse(html);
  const pre = root.querySelector('pre');

  if (!pre) throw new Error("<pre> etiketi bulunamadı.");

  const lines = pre.text.trim().split("\n").slice(6); // ilk 6 satır başlık
  const data = lines
    .filter(line => /^\d{4}\.\d{2}\.\d{2}/.test(line))
    .map(line => {
      const parts = line.trim().split(/\s+/);
      return {
        date: parts[0],
        time: parts[1],
        latitude: parseFloat(parts[2]),
        longitude: parseFloat(parts[3]),
        depth: parseFloat(parts[4]),
        md: parts[5],
        ml: parts[6],
        mw: parts[7],
        location: parts.slice(8, -1).join(" "),
        solution: parts.at(-1)
      };
    });

  fs.writeFileSync("boun-depremler.json", JSON.stringify(data, null, 2));
  console.log(`✅ ${data.length} satır verisi yazıldı.`);
} catch (err) {
  console.error("❌ Boğaziçi verisi alınamadı:", err.message);
  process.exit(0);
}
