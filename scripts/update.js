import fetch from 'node-fetch';
import fs from 'fs';

const now = new Date();
const end = now.toISOString().split('.')[0];
const start = new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString().split('.')[0];
const afadUrl = `https://deprem.afad.gov.tr/apiv2/event/filter?start=${start}&end=${end}&limit=500&orderby=timedesc`;

try {
  const response = await fetch(afadUrl);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const afadData = await response.json();

  fs.writeFileSync("afad-depremler.json", JSON.stringify(afadData, null, 2));
  console.log("✅ AFAD verisi başarıyla yazıldı.");
} catch (err) {
  console.error("❌ AFAD verisi alınamadı:", err.message);
  process.exit(0); // hata olsa bile flow dursun
}
