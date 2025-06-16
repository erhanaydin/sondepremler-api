import fetch from 'node-fetch';
import fs from 'fs';

// Türkiye ve yakın çevresi için kabaca koordinat filtrelemesi
const url =
  'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=now-7days&minlatitude=35&maxlatitude=43&minlongitude=25&maxlongitude=45&orderby=time&limit=500';

try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const { features } = await response.json();
  const data = features.map(({ properties, geometry }) => {
    const [lng, lat, depth] = geometry.coordinates;
    const dateObj = new Date(properties.time);
    const date = dateObj.toISOString().split('T')[0].replace(/-/g, '.');
    const time = dateObj.toTimeString().split(' ')[0];

    return {
      title: properties.place,
      type: properties.status || 'reviewed',
      date: `${date} ${time}`,
      lat: +lat.toFixed(4),
      lng: +lng.toFixed(4),
      md: '-.-',
      ml: '-.-',
      mw: properties.mag?.toString() || '-.-',
      depth: +depth.toFixed(1),
      coordinates: [lat, lng],
      geojson: geometry,
      location_properties: '',
      date_day: date,
      date_hour: time,
      timestamp: false,
      location_tz: '',
      city: '',
    };
  });

  fs.writeFileSync('api/usgs-depremler.json', JSON.stringify(data, null, 2));
  console.log(`✅ USGS verisi başarıyla yazıldı: ${data.length} kayıt`);
} catch (err) {
  console.error('❌ USGS verisi alınamadı:', err.message);
  process.exit(0);
}
