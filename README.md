# PerkakasID

> Digital tools built for Indonesian needs that also serve users anywhere. A collection of small, handy tools that run entirely in your browser: no server, no build step, no dependencies. Everything is processed locally, so your data never leaves your device.

[![License: MIT](https://img.shields.io/badge/license-MIT-0f766e.svg)](LICENSE) [![Vanilla JS](https://img.shields.io/badge/vanilla-JS-1f1e1c.svg)](#)

## About

PerkakasID is a collection of lightweight digital tools centered on Indonesian needs, and useful globally: conversions, calculations, and small data processing. The whole site is plain HTML, CSS, and JavaScript running 100 percent in the browser, with no server, no build step, and no dependencies. Data you enter is processed only on your own device, every tool is free, and navigation uses plain hash links such as `#/terbilang`.

The interface speaks Indonesian and English. Switch it anytime with the ID and EN buttons in the header; the choice is remembered in your browser and the open page re-renders without a reload.

## Tools

### Money and Business

- **Terbilang Rupiah / Number to Words** (`#/terbilang`): converts numbers into Indonesian words for invoices and receipts (units up to trillions, with "se-" for seratus and seribu). Rupiah mode adds the Rp display with thousand separators. An output language switch also produces plain American style English number words, so non-Indonesian users can use it as a number to words converter.

### Text and Language

- **Penghitung Kata / Word Counter** (`#/penghitung-kata`): live statistics while you type: words, characters, characters without spaces, sentences, paragraphs, and estimated reading time (200 words per minute).

### Data and Developer

- **JSON Formatter** (`#/json-formatter`): format (2 space indent), minify, and validate JSON with error messages that include the line and column, plus copy to clipboard, all in the browser.

## Tool Roadmap

The tools below are planned and open for anyone to pick up. See [CONTRIBUTING.md](CONTRIBUTING.md) for the guide, or look for the `good first issue` label in the issue list.

- PPh 21 TER calculator
- QRIS generator
- Unit converter
- Password generator
- NIK format checker for testing
- KPR mortgage calculator
- ATS CV builder

## Running Locally

Just open `index.html` directly in your browser, or run any static server, for example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

The service worker (offline cache) only activates when served over `http://localhost` or HTTPS.

## Contributing

Contributions are very welcome, including first time contributors. Read [CONTRIBUTING.md](CONTRIBUTING.md) to add a new tool in 3 steps.

## License

[MIT](LICENSE). Copyright (c) Edzard9.

---

## Bahasa Indonesia

> Perkakas digital untuk kebutuhan Indonesia yang juga berguna bagi siapa saja. Kumpulan perkakas kecil yang berjalan sepenuhnya di browser Anda: tanpa server, tanpa build step, tanpa dependensi. Semuanya diproses lokal, jadi data Anda tidak pernah meninggalkan perangkat.

### Tentang

PerkakasID adalah kumpulan perkakas digital ringan yang berpusat pada kebutuhan orang Indonesia dan tetap berguna secara global: konversi, perhitungan, dan pengolahan data kecil. Seluruh situs berupa HTML, CSS, dan JavaScript murni yang berjalan 100 persen di browser tanpa server, tanpa build step, dan tanpa dependensi. Data yang Anda masukkan hanya diproses di perangkat Anda sendiri, semua tool gratis, dan navigasinya cukup lewat tautan hash seperti `#/terbilang`.

Antarmuka tersedia dalam Bahasa Indonesia dan Inggris. Ganti kapan saja lewat tombol ID dan EN di header; pilihan Anda disimpan di browser, dan halaman yang terbuka di-render ulang tanpa reload.

### Kategori dan Tool

#### Uang dan Usaha

- **Terbilang Rupiah** (`#/terbilang`): ubah angka menjadi kata terbilang untuk nota dan kwitansi (satuan sampai triliun, dengan "se-" untuk seratus dan seribu), mode rupiah menyertakan tampilan Rp dengan pemisah ribuan. Pilihan bahasa hasil juga menghasilkan kata angka bahasa Inggris gaya Amerika, sehingga bisa dipakai sebagai konverter angka ke kata.

#### Teks dan Bahasa

- **Penghitung Kata** (`#/penghitung-kata`): statistik langsung saat mengetik, meliputi jumlah kata, karakter, karakter tanpa spasi, kalimat, paragraf, dan perkiraan waktu baca (200 kata per menit).

#### Data dan Developer

- **JSON Formatter** (`#/json-formatter`): format (indentasi 2 spasi), minify, dan validasi JSON dengan pesan error berisi posisi baris dan kolom, plus salin hasil, semuanya di browser.

### Peta Jalan Tool

Tool berikut direncanakan dan terbuka untuk diambil siapa saja. Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduannya, atau cari label `good first issue` di daftar isu.

- Kalkulator PPh 21 TER
- Generator QRIS
- Konverter Satuan
- Generator Password
- Cek Format NIK untuk pengujian
- Kalkulator KPR
- Pembuat CV ATS

### Menjalankan Lokal

Cukup buka `index.html` langsung di browser, atau jalankan server statis apa pun, misalnya:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

Service worker (cache offline) hanya aktif bila diakses lewat `http://localhost` atau HTTPS.

### Kontribusi

Kontribusi sangat disambut, termasuk untuk kontributor pertama. Baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk cara menambah tool baru dalam 3 langkah.

### Lisensi

[MIT](LICENSE). Hak cipta (c) Edzard9.
