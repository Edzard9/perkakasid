# Contributing to PerkakasID

Welcome, especially if this is your first contribution! PerkakasID is deliberately simple so anyone can follow along: no build step, no dependencies, just a browser and an editor. Pick an issue labeled `good first issue` or propose a new tool through an issue, then follow the steps below.

## Tool Contract (short)

- One tool per file `tools/<id>.js`, vanilla JavaScript, no npm, all processing local in the browser.
- Register with `registerTool({...})` on `DOMContentLoaded`.
- Required registry fields: `id`, `nama` and `namaEn`, `kategori` (one of the stable keys: `kuliah`, `uang`, `teks`, `dokumen`, `data`, `sehari`), `ikon`, `deskripsi` and `deskripsiEn`.
- Every UI string inside your tool follows the active language, using the pattern from the example tools: a small local string table picked by `LANG.aktif`.
- Common strings (copy, print, generate, and so on) come from `t()` in `lang.js`. Category labels come from `tKategori()`.
- No em-dash; use a plain hyphen or a period.
- Register your file in `sw.js` (the `BERKAS` array) and in `index.html` above `app.js`.

Steps: create `tools/<id>.js`, register it in `sw.js` and `index.html`, open a pull request. Full details in the Indonesian section below.

## AI Usage

Contributions made with AI help of any kind (coding agents, chatbots, code completion) must be disclosed in the pull request description. The disclosure covers three things:

- The agent or tool used, for example OpenCode, Claude Code, GitHub Copilot, ChatGPT.
- The model used, for example GLM-5.3-Flash, Claude, GPT.
- The testing you did as a human over the result, for example manually checking the acceptance-criteria values, trying the tool in a desktop browser and on a phone, and so on.

If you did not use AI at all, write `No AI used`.

The disclosure belongs in the PR description, not in the commit: commits must not list AI as co-author or collaborator.

Why: transparency for reviewers and users, and the reviewer stays a human who is responsible for the code that gets merged.

Example format:

```
AI disclosure: Built with OpenCode (model: GLM-5.3-Flash via 9Router). Tested by: manually verifying every acceptance-criteria value in the issue, plus trying the tool in a mobile browser.
```

---

# Berkontribusi di PerkakasID

Selamat datang, apalagi kalau ini kontribusi pertama Anda! PerkakasID sengaja dibuat sederhana supaya mudah diikuti siapa pun: tidak ada build step, tidak ada dependensi, cukup browser dan editor. Ambil salah satu isu berlabel `good first issue` atau usulkan tool baru lewat isu, lalu ikuti tiga langkah di bawah.

## Menambah Tool Baru dalam 3 Langkah

### 1. Buat file `tools/<id>.js` yang memanggil `registerTool`

Satu tool satu file. `registerTool` dipanggil saat `DOMContentLoaded` karena file tool dimuat sebelum `app.js`, sehingga registry baru lengkap saat router mulai.

```js
(() => {
  // Tabel string lokal mengikuti pola tool contoh: dipilih berdasarkan LANG.aktif.
  const ST = {
    "label-input": { id: "Masukan", en: "Input" },
  };

  function daftar() {
    registerTool({
      id: "nama-tool",             // dipakai sebagai rute #/nama-tool
      nama: "Nama Tool",           // label Indonesia, tampil di kartu dan judul halaman
      namaEn: "Tool Name",         // label Inggris, wajib
      kategori: "teks",            // kunci kategori: kuliah, uang, teks, dokumen, data, sehari
      ikon: "✂️",                  // emoji yang sesuai fungsi tool
      deskripsi: "Kalimat singkat tentang apa yang dilakukan tool.",
      deskripsiEn: "One short sentence about what the tool does.",
      render(el) {
        // isi el dengan HTML tool, label memakai ST[...][LANG.aktif]
        // string umum (Salin hasil, Cetak, dan lainnya) memakai t("salin") dari lang.js
        // lalu pasang event listener milikmu di sini
      },
    });
  }

  document.addEventListener("DOMContentLoaded", daftar);
})();
```

### 2. Daftarkan file barumu di dua tempat

Tambahkan berkas ke daftar cache di `sw.js` (array `BERKAS`) dan tambahkan tag `<script src="tools/<id>.js"></script>` di `index.html`, di atas `app.js`.

### 3. Buka Pull Request

Jelaskan singkat apa yang dilakukan tool barumu. Cocokkan judul PR dengan isu bila ada.

## Aturan Tool

- Vanilla JavaScript murni, tanpa dependensi dan tanpa npm.
- Semua pemrosesan berjalan lokal di browser, tidak ada data yang dikirim ke server.
- Dua bahasa wajib: registry menyertakan `namaEn` dan `deskripsiEn`, dan seluruh string UI di dalam tool mengikuti bahasa aktif dengan pola tool contoh (tabel string lokal `ST` yang dipilih lewat `LANG.aktif`).
- String UI umum diambil dari `t()` di `lang.js` (misalnya Salin hasil, Cetak, Hasilkan, Tambah Baris, Hapus), dan label kategori dari `tKategori()`.

  Untuk tool khas Indonesia seperti terbilang rupiah, `namaEn` dan `deskripsiEn` tetap wajib sebagai penjelasan berbahasa Inggris.
- Kategori memakai kunci yang sudah ada: `kuliah`, `uang`, `teks`, `dokumen`, `data`, `sehari`. Usulkan kunci baru lewat isu bila memang perlu.
- Tanpa em-dash, pakai tanda hubung biasa atau titik.
- Satu tool satu file `tools/<id>.js`.
- Sertakan deskripsi singkat satu kalimat di registry.

## Penggunaan AI

Kontribusi yang dibuat dengan bantuan AI dalam bentuk apa pun (agen pemrograman, chatbot, pelengkapan kode) wajib diungkapkan di deskripsi pull request. Pengungkapan mencakup tiga hal:

- Agen atau alat yang dipakai, misalnya OpenCode, Claude Code, GitHub Copilot, ChatGPT.
- Model yang dipakai, misalnya GLM-5.3-Flash, Claude, GPT.
- Pengujian yang Anda lakukan sebagai manusia atas hasilnya, misalnya memeriksa angka kriteria penerimaan secara manual, mencoba tool di browser desktop dan di HP, dan sebagainya.

Bila tidak memakai AI sama sekali, tulis `No AI used`.

Pengungkapan ditaruh di deskripsi PR, bukan di commit: commit tidak boleh mencantumkan AI sebagai co-author atau kolaborator.

Alasannya: transparansi bagi peninjau dan pengguna, dan peninjau tetap manusia yang bertanggung jawab atas kode yang di-merge.

Contoh format:

```
AI disclosure: Built with OpenCode (model: GLM-5.3-Flash via 9Router). Tested by: manually verifying every acceptance-criteria value in the issue, plus trying the tool in a mobile browser.
```
