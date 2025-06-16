// scripts/update.js
import fs from 'fs'
import fetch from 'node-fetch'

const now = new Date().toISOString()

async function fetchAndSave(url, path, label) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    const payload = {
      lastUpdate: now,
      source: label,
      data
    }

    fs.writeFileSync(path, JSON.stringify(payload, null, 2))
    console.log(`✅ ${label} verisi yazıldı: ${path}`)
  } catch (err) {
    console.error(`❌ ${label} verisi alınamadı:`, err.message)
  }
}

await fetchAndSave(
  'https://deprem.afad.gov.tr/apiv2/event/filter?start=' +
    new Date(Date.now() - 5 * 86400000).toISOString() +
    '&end=' + now +
    '&limit=500&orderby=timedesc',
  'afad-depremler.json',
  'AFAD'
)

await fetchAndSave(
  'https://erhanaydin.github.io/sondepremler-api/api/boun-depremler.json',
  'boun-depremler.json',
  'Boğaziçi'
) 

console.log(`✅ Tüm veriler güncellendi. Zaman: ${now}`)
