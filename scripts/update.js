import fetch from 'node-fetch';
import fs from 'fs';

const url = "https://deprem.afad.gov.tr/apiv2/event/filter?start=" + new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() + "&end=" + new Date().toISOString() + "&limit=500&orderby=timedesc";
const now = new Date().toISOString();

try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const raw = await response.text();
  const json = JSON.parse(raw);

  if (!Array.isArray(json)) throw new Error("AFAD JSON geçersiz.");

  const data = json.map(item => {
    const lat = parseFloat(item.latitude);
    const lng = parseFloat(item.longitude);
    const date = item.date.split("T")[0];
    const time = item.date.split("T")[1];
    const city = item.province?.toUpperCase() || "";

    return {
      title: `${item.district ? item.district.toUpperCase() + "-" : ""}${city}`.trim(),
      type: item.isEventUpdate ? "Revize" : "İlksel",
      date: `${date} ${time}`,
      lat,
      lng,
      md: item.md,
      ml: item.ml,
      mw: item.mw,
      depth: item.depth,
      coordinates: [lng, lat],
      geojson: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        properties: {
          mag: item.ml,
          place: item.location,
          time: `${date} ${time}`
        }
      },
      location_properties: "",
      date_day: date,
      date_hour: time,
      timestamp: false,
      location_tz: "",
      city
    }
  });

  const payload = {
    lastUpdate: now,
    source: "AFAD",
    data
  };

  fs.writeFileSync("afad-depremler.json", JSON.stringify(payload, null, 2));
  console.log(`✅ ${data.length} satır verisi yazıldı.`);
} catch (err) {
  console.error("❌ AFAD verisi alınamadı:", err.message);
  process.exit(0);
}
