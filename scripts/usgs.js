import fetch from 'node-fetch';
import fs from 'fs';

const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data = await response.json();

  const payload = data.features
    .map(eq => {
      const props = eq.properties;
      const coords = eq.geometry.coordinates;

      // Türkiye çevresini hedefle (örnek: enlem 35-43, boylam 25-45)
      const lat = coords[1];
      const lng = coords[0];
      if (lat < 35 || lat > 43 || lng < 25 || lng > 45) return null;

      const dateObj = new Date(props.time);
      const date = dateObj.toISOString().split('T')[0].replace(/-/g, '.');
      const time = dateObj.toTimeString().split(' ')[0];

      return {
        title: props.place,
        type: props.status === "reviewed" ? "Revize" : "İlksel",
        date: `${date} ${time}`,
        lat,
        lng,
        md: "-.-",
        ml: "-.-",
        mw: props.mag?.toString() || "-.-",
        depth: coords[2]?.toFixed(1) || "-.-",
        coordinates: [lat, lng],
        geojson: eq.geometry,
        location_properties: "",
        date_day: date,
        date_hour: time,
        timestamp: false,
        location_tz: "",
        city: ""
      };
    })
    .filter(Boolean);

  fs.writeFileSync("api/usgs-depremler.json", JSON.stringify(payload, null, 2));
  console.log(`✅ USGS verisi işlendi (${payload.length} kayıt).`);
} catch (err) {
  console.error("❌ USGS verisi alınamadı:", err.message);
  process.exit(0);
}
