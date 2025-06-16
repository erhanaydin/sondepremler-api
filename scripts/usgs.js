// scripts/usgs.js
import fetch from 'node-fetch';
import fs from 'fs';

const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=35&maxlatitude=43&minlongitude=25&maxlongitude=45&orderby=time&limit=200`;

try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const json = await response.json();
  const earthquakes = json.features.map((f) => {
    const coords = f.geometry.coordinates;
    const props = f.properties;
    const date = new Date(props.time);

    return {
      title: props.place || "Unknown",
      type: props.status || "",
      date: date.toISOString().replace("T", " ").split(".")[0],
      lat: coords[1],
      lng: coords[0],
      md: "-.-",
      ml: props.mag?.toFixed(1) || "-.-",
      mw: "-.-",
      depth: coords[2]?.toFixed(1) || "-.-",
      coordinates: [coords[0], coords[1]],
      geojson: f,
      location_properties: "",
      date_day: date.toISOString().slice(0, 10),
      date_hour: date.toISOString().slice(11, 19),
      timestamp: props.time,
      location_tz: "",
      city: props.place?.split("(")[1]?.replace(")", "") || ""
    };
  });

  const payload = {
    lastUpdate: new Date().toISOString(),
    source: "USGS",
    data: earthquakes
  };

  fs.writeFileSync("api/usgs-depremler.json", JSON.stringify(payload, null, 2));
  console.log(`✅ USGS verisi yazıldı (${earthquakes.length} kayıt)`);

} catch (err) {
  console.error("❌ USGS verisi alınamadı:", err.message);
  process.exit(0);
}
