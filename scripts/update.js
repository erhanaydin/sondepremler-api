const fs = require("fs");
const https = require("https");

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error("AFAD JSON geçersiz"));
        }
      });
    }).on("error", reject);
  });
}

(async () => {
  const now = new Date();
  const end = now.toISOString().split('.')[0];
  const start = new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString().split('.')[0];
  const afadUrl = `https://deprem.afad.gov.tr/apiv2/event/filter?start=${start}&end=${end}&limit=500&orderby=timedesc`;

  try {
    const afadData = await fetchJson(afadUrl);
    fs.writeFileSync("afad-depremler.json", JSON.stringify(afadData, null, 2));
    console.log("✅ AFAD verisi başarıyla yazıldı.");
  } catch (err) {
    console.error("❌ AFAD verisi alınamadı:", err.message);
    // Dosya yazılmasın, işlem burada dursun
    process.exit(0); // kritik değilse 0, hata verecekse 1
  }
})();
