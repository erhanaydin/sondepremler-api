# 🌍 Son Depremler API

Türkiye ve çevresindeki son depremleri **AFAD**, **Boğaziçi Üniversitesi Kandilli Rasathanesi** ve **USGS (ABD Jeoloji Araştırmaları Kurumu)** kaynaklarından alıp, JSON API olarak sunar.

Veriler [GitHub Actions](https://github.com/features/actions) ile her **3 dakikada bir** otomatik olarak güncellenir ve [GitHub Pages](https://pages.github.com/) ile barındırılır.

---

## 🔗 Canlı API Linkleri

| Kaynak                 | Açıklama                             | JSON URL |
|------------------------|--------------------------------------|----------|
| **AFAD**               | Son 500 deprem (AFAD API üzerinden) | [`/api/afad-depremler.json`](https://erhanaydin.github.io/sondepremler-api/api/afad-depremler.json) |
| **Boğaziçi Kandilli**  | Son 500 deprem (HTML scraping ile)  | [`/api/boun-depremler.json`](https://erhanaydin.github.io/sondepremler-api/api/boun-depremler.json) |
| **USGS**               | Global depremler (M>=1.5)            | [`/api/usgs-depremler.json`](https://erhanaydin.github.io/sondepremler-api/api/usgs-depremler.json) |

---

## 📦 Veri Formatı

Her API JSON dizisi döner. Ortaklaştırılmış bir örnek veri nesnesi:

```json
{
  "title": "SOGUTLU-PUTURGE (MALATYA)",
  "type": "İlksel",
  "date": "2025.06.16 23:11:48",
  "lat": 38.2137,
  "lng": 38.631,
  "md": "-.-",
  "ml": "2.0",
  "mw": "-.-",
  "depth": "5.0",
  "coordinates": [38.631, 38.2137],
  "geojson": {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [38.631, 38.2137]
    },
    "properties": {
      "mag": "2.0",
      "place": "SOGUTLU-PUTURGE (MALATYA)",
      "time": "2025.06.16 23:11:48"
    }
  },
  "location_properties": "",
  "date_day": "2025.06.16",
  "date_hour": "23:11:48",
  "timestamp": false,
  "location_tz": "",
  "city": "MALATYA"
}
```

---

## 🚀 Kullanım

Veriyi frontend, mobil uygulama veya başka bir sistemde aşağıdaki gibi doğrudan çekebilirsiniz:

```js
fetch("https://erhanaydin.github.io/sondepremler-api-work/api/afad-depremler.json")
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## ⚙️ Teknolojiler

- Node.js (v20)
- GitHub Actions (otomasyon)
- GitHub Pages (hosting)
- `node-fetch`, `node-html-parser`
- JSON standardizasyon ve geoJSON desteği

---

## 📜 Lisans

MIT lisansı ile sunulmuştur.  
Veriler kamuya açık kaynaklardan sağlanmaktadır:

- [AFAD](https://deprem.afad.gov.tr/)
- [Boğaziçi Kandilli](http://www.koeri.boun.edu.tr/)
- [USGS](https://earthquake.usgs.gov/)

---

## 👨‍💻 Geliştirici

- [@erhanaydin](https://github.com/erhanaydin)
