const fs = require("fs");
const https = require("https");

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

(async () => {
  const now = new Date();
  const end = now.toISOString().split('.')[0];
  const start = new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString().split('.')[0];
  const afadUrl = `https://deprem.afad.gov.tr/apiv2/event/filter?start=${start}&end=${end}&limit=500&orderby=timedesc`;

  try {
    const afadRaw = await fetch(afadUrl);
    const afadParsed = JSON.parse(afadRaw);
    fs.writeFileSync("afad-depremler.json", JSON.stringify(afadParsed, null, 2));
    console.log("✅ AFAD verisi yazıldı.");
  } catch (e) {
    console.error("❌ AFAD verisi alınamadı", e);
  }

  // Boğaziçi için istersen html parser ekleyelim
})();
