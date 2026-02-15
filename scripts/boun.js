import fetch from 'node-fetch';
import fs from 'fs';
import { parse } from 'node-html-parser';

const url = "http://www.koeri.boun.edu.tr/scripts/lst9.asp";
const now = new Date().toISOString();

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
      const date = parts[0];
      const time = parts[1];
      const lat = parseFloat(parts[2]);
      const lng = parseFloat(parts[3]);
      const depth = parts[4];
      const md = parts[5];
      const ml = parts[6];
      const mw = parts[7];
      const location = parts.slice(8, -1).join(" ");
      const type = parts.at(-1);
      const cityMatch = location.match(/\((.*?)\)/);
      const city = cityMatch ? cityMatch[1].toUpperCase() : "";

      return {
        title: location,
        type,
        date: `${date} ${time}`,
        lat,
        lng,
        md,
        ml,
        mw,
        depth,
        coordinates: [lng, lat],
        geojson: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          properties: {
            mag: ml,
            place: location,
            time: `${date} ${time}`
          }
        },
        location_properties: "",
        date_day: date,
        date_hour: time,
        timestamp: false,
        location_tz: "",
        city
      };
    });

  const payload = {
    lastUpdate: now,
    source: "Boğaziçi",
    data
  };

  fs.writeFileSync("api/boun-depremler.json", JSON.stringify(payload, null, 2));
  console.log(`✅ ${data.length} satır verisi yazıldı.`);
} catch (err) {
  console.error("❌ Boğaziçi verisi alınamadı:", err.message);
  process.exit(0);
}
