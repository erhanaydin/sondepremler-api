import fetch from 'node-fetch';
import fs from 'fs';

// 3 gün önce
const start = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 19); // YYYY-MM-DDTHH:MM:SS

// Şimdi
const end = new Date()
  .toISOString()
  .slice(0, 19);

const url = `https://servisnet.afad.gov.tr/apigateway/deprem/apiv2/event/filter?start=${start}&end=${end}&limit=500&orderby=timedesc`;

try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = await response.json();

  const data = json.map(event => {
    return {
      title: `${event.location}`,
      type: event.isEventUpdate ? "Güncellenmiş" : "İlksel",
      date: `${event.date.split("T")[0]} ${event.date.split("T")[1]}`,
      lat: parseFloat(event.latitude),
      lng: parseFloat(event.longitude),
      md: event.md || "-.-",
      ml: event.magnitude || "-.-",
      mw: event.mw || "-.-",
      depth: parseFloat(event.depth),
      coordinates: [parseFloat(event.longitude), parseFloat(event.latitude)],
      geojson: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(event.longitude), parseFloat(event.latitude)]
        },
        properties: {
          mag: parseFloat(event.ml) || 0,
          place: `${event.location} (${event.province})`,
          time: new Date(event.date).getTime(),
        }
      },
      location_properties: "",
      date_day: event.date.split("T")[0],
      date_hour: event.date.split("T")[1],
      timestamp: false,
      location_tz: "",
      city: event.province
    };
  });

  fs.writeFileSync("api/afad-depremler.json", JSON.stringify(data, null, 2));
  console.log(`✅ AFAD verisi yazıldı: ${data.length} kayıt.`);
} catch (err) {
  console.error("❌ AFAD verisi alınamadı:", err.message);
  process.exit(0);
}
