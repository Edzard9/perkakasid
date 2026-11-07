(() => {
  const KECIL = ['dan', 'yang', 'di', 'ke', 'dari', 'of', 'the', 'and', 'in', 'on', 'for'];
  const M1 = '\u0001';
  const M2 = '\u0002';

  function inisial(depan) {
    return depan.split(/\s+/).filter(Boolean).map((k) => k.charAt(0).toUpperCase() + '.').join(' ');
  }

  function apaSatu(p) {
    return p.depan ? `${p.belakang}, ${inisial(p.depan)}` : p.belakang;
  }

  function ieeeSatu(p) {
    return p.depan ? `${inisial(p.depan)} ${p.belakang}` : p.belakang;
  }

  function topi(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function titik(s) {
    return s.endsWith('.') ? s : s + '.';
  }

  // ponytail: sentence case disederhanakan jadi huruf kecil semua lalu kapital awal;
  // nama diri di tengah judul akan turun huruf, tambahkan daftar pengecualian bila terganggu
  function kalimat(t) {
    const s = t.trim().toLowerCase();
    return s ? topi(s) : s;
  }

  function judulBesar(t) {
    return t.trim().split(/\s+/).map((k, i) =>
      i && KECIL.includes(k.toLowerCase()) ? k.toLowerCase() : topi(k.toLowerCase())
    ).join(' ');
  }

  function rentang(halaman) {
    return halaman.replace(/-/g, '\u2013');
  }

  function doiBersih(doi) {
    return doi.trim().replace(/^https:\/\/doi\.org\//, '');
  }

  function parsePenulis(teks = '') {
    return teks.split('\n').map((b) => b.trim()).filter(Boolean).map((b) => {
      const i = b.indexOf(',');
      return i < 0 ? { belakang: b, depan: '' } : { belakang: b.slice(0, i).trim(), depan: b.slice(i + 1).trim() };
    });
  }

  function gabung(daftar, awalan) {
    if (!daftar.length) return '';
    if (daftar.length === 1) return daftar[0];
    return daftar.slice(0, -1).join(', ') + awalan + daftar[daftar.length - 1];
  }

  function penulisApa(teks) {
    return gabung(parsePenulis(teks).map(apaSatu), ', & ');
  }

  function penulisIeee(teks) {
    const a = parsePenulis(teks).map(ieeeSatu);
    return a.length === 2 ? a.join(' and ') : gabung(a, ' and ');
  }

  function apaBuku(d) {
    return `${titik(penulisApa(d.penulis))} (${d.tahun}). ${M1}${kalimat(d.judul)}${M2}. ${d.penerbit}.`;
  }

  function apaJurnal(d) {
    let s = `${titik(penulisApa(d.penulis))} (${d.tahun}). ${M1}${kalimat(d.judul)}${M2}. ${M1}${d.jurnal}${M2}`;
    if (d.volume) s += `, ${M1}${d.volume}${M2}${d.nomor ? `(${d.nomor})` : ''}`;
    if (d.halaman) s += `, ${rentang(d.halaman)}`;
    if (d.doi) s += `. https://doi.org/${d.doi}`;
    return s;
  }

  function apaWebsite(d) {
    const awal = penulisApa(d.penulis)
      ? `${titik(penulisApa(d.penulis))} (${d.tahun}). ${M1}${kalimat(d.judul)}${M2}.`
      : `${M1}${kalimat(d.judul)}${M2}. (${d.tahun}).`;
    return `${awal} ${M1}${d.situs}${M2}. ${d.url}`;
  }

  function ieeeBuku(d) {
    const kota = d.kota ? `${d.kota}: ` : '';
    return `${penulisIeee(d.penulis)}, ${M1}${judulBesar(d.judul)}${M2}. ${kota}${d.penerbit}, ${d.tahun}.`;
  }

  function ieeeJurnal(d) {
    let s = `${penulisIeee(d.penulis)}, "${d.judul}," ${M1}${judulBesar(d.jurnal)}${M2}`;
    if (d.volume) s += `, vol. ${d.volume}`;
    if (d.nomor) s += `, no. ${d.nomor}`;
    if (d.halaman) s += `, pp. ${rentang(d.halaman)}`;
    s += `, ${d.tahun}.`;
    if (d.doi) s += ` doi: ${d.doi}.`;
    return s;
  }

  function ieeeWebsite(d) {
    const awal = penulisIeee(d.penulis) ? `${penulisIeee(d.penulis)}, ` : '';
    let s = `${awal}"${d.judul}," ${M1}${d.situs}${M2}, ${d.tahun}. [Online]. Available: ${d.url}`;
    if (d.akses) s += ` [Accessed: ${d.akses}].`;
    return s;
  }

  function formatAPA(jenis, d) {
    return { buku: apaBuku, jurnal: apaJurnal, website: apaWebsite }[jenis](d);
  }

  function formatIEEE(jenis, d) {
    return { buku: ieeeBuku, jurnal: ieeeJurnal, website: ieeeWebsite }[jenis](d);
  }

  function polos(raw) {
    return raw.replace(/[\u0001\u0002]/g, '');
  }

  function keHtml(raw) {
    return polos(raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'))
      .replace(/\u0001/g, '<i>')
      .replace(/\u0002/g, '</i>');
  }

  const ST = {
    'jenis-sumber': { id: 'Jenis sumber', en: 'Source type' },
    buku: { id: 'Buku', en: 'Book' },
    jurnal: { id: 'Jurnal', en: 'Journal article' },
    website: { id: 'Website', en: 'Website' },
    penulis: { id: 'Penulis (satu penulis per baris, Nama Belakang, Nama Depan)', en: 'Authors (one per line, Last, First names)' },
    'contoh-penulis': { id: 'Sulton, Muhamad Ilham\nPrasetyo, Budi\nPusat Statistik', en: 'Sulton, Muhamad Ilham\nPrasetyo, Budi\nStatistics Office' },
    tahun: { id: 'Tahun', en: 'Year' },
    'judul-buku': { id: 'Judul buku', en: 'Book title' },
    kota: { id: 'Kota', en: 'City' },
    penerbit: { id: 'Penerbit', en: 'Publisher' },
    'judul-artikel': { id: 'Judul artikel', en: 'Article title' },
    'nama-jurnal': { id: 'Nama jurnal', en: 'Journal name' },
    volume: { id: 'Volume', en: 'Volume' },
    nomor: { id: 'Nomor', en: 'Issue' },
    halaman: { id: 'Halaman (misal 12-25)', en: 'Pages (e.g. 12-25)' },
    doi: { id: 'DOI (opsional)', en: 'DOI (optional)' },
    'judul-halaman': { id: 'Judul halaman', en: 'Page title' },
    'nama-situs': { id: 'Nama situs', en: 'Site name' },
    url: { id: 'URL', en: 'URL' },
    'tanggal-akses': { id: 'Tanggal akses (opsional)', en: 'Access date (optional)' },
    kosong: { id: 'Isi judul dan tahun untuk melihat sitasinya.', en: 'Fill in the title and year to see the citation.' },
  };

  function daftar() {
    registerTool({
      id: 'daftar-pustaka',
      nama: 'Daftar Pustaka Otomatis',
      namaEn: 'Reference Generator',
      kategori: 'kuliah',
      ikon: '📚',
      deskripsi: 'Susun sitasi buku, jurnal, dan website dalam gaya APA 7 dan IEEE, tinggal salin.',
      deskripsiEn: 'Build book, journal, and website citations in APA 7 and IEEE styles, ready to copy.',
      render(wadah) {
        const s = (k) => ST[k][LANG.aktif];
        wadah.innerHTML = `
          <label for="dp-jenis">${s('jenis-sumber')}</label>
          <select id="dp-jenis">
            <option value="buku">${s('buku')}</option>
            <option value="jurnal">${s('jurnal')}</option>
            <option value="website">${s('website')}</option>
          </select>
          <label for="dp-penulis">${s('penulis')}</label>
          <textarea id="dp-penulis" placeholder="${s('contoh-penulis')}"></textarea>
          <label for="dp-tahun">${s('tahun')}</label>
          <input id="dp-tahun" type="text" inputmode="numeric" autocomplete="off">
          <fieldset id="dp-grup-buku">
            <label for="dp-judul-buku">${s('judul-buku')}</label>
            <input id="dp-judul-buku" type="text" autocomplete="off">
            <label for="dp-kota">${s('kota')}</label>
            <input id="dp-kota" type="text" autocomplete="off">
            <label for="dp-penerbit">${s('penerbit')}</label>
            <input id="dp-penerbit" type="text" autocomplete="off">
          </fieldset>
          <fieldset id="dp-grup-jurnal" hidden>
            <label for="dp-judul-artikel">${s('judul-artikel')}</label>
            <input id="dp-judul-artikel" type="text" autocomplete="off">
            <label for="dp-nama-jurnal">${s('nama-jurnal')}</label>
            <input id="dp-nama-jurnal" type="text" autocomplete="off">
            <label for="dp-volume">${s('volume')}</label>
            <input id="dp-volume" type="text" inputmode="numeric" autocomplete="off">
            <label for="dp-nomor">${s('nomor')}</label>
            <input id="dp-nomor" type="text" inputmode="numeric" autocomplete="off">
            <label for="dp-halaman">${s('halaman')}</label>
            <input id="dp-halaman" type="text" autocomplete="off">
            <label for="dp-doi">${s('doi')}</label>
            <input id="dp-doi" type="text" autocomplete="off">
          </fieldset>
          <fieldset id="dp-grup-website" hidden>
            <label for="dp-judul-halaman">${s('judul-halaman')}</label>
            <input id="dp-judul-halaman" type="text" autocomplete="off">
            <label for="dp-nama-situs">${s('nama-situs')}</label>
            <input id="dp-nama-situs" type="text" autocomplete="off">
            <label for="dp-url">${s('url')}</label>
            <input id="dp-url" type="text" autocomplete="off">
            <label for="dp-akses">${s('tanggal-akses')}</label>
            <input id="dp-akses" type="text" autocomplete="off">
          </fieldset>
          <div class="aksi">
            <button type="button" id="dp-salin-apa">${t('salin')}</button>
            <button type="button" id="dp-salin-ieee">${t('salin')}</button>
          </div>
          <div class="hasil" id="dp-hasil" aria-live="polite"></div>`;

        const q = (id) => wadah.querySelector('#dp-' + id);
        const jenis = q('jenis');
        const hasil = q('hasil');
        const rawApa = { raw: '' };
        const rawIeee = { raw: '' };

        function data() {
          const judul = (
            jenis.value === 'buku' ? q('judul-buku') : jenis.value === 'jurnal' ? q('judul-artikel') : q('judul-halaman')
          ).value.trim();
          const d = { judul, tahun: q('tahun').value.trim(), penulis: q('penulis').value };
          if (jenis.value === 'buku') return { ...d, kota: q('kota').value.trim(), penerbit: q('penerbit').value.trim() };
          if (jenis.value === 'jurnal') {
            return {
              ...d,
              jurnal: q('nama-jurnal').value.trim(),
              volume: q('volume').value.trim(),
              nomor: q('nomor').value.trim(),
              halaman: q('halaman').value.trim(),
              doi: doiBersih(q('doi').value),
            };
          }
          return { ...d, situs: q('nama-situs').value.trim(), url: q('url').value.trim(), akses: q('akses').value.trim() };
        }

        function perbarui() {
          q('grup-buku').hidden = jenis.value !== 'buku';
          q('grup-jurnal').hidden = jenis.value !== 'jurnal';
          q('grup-website').hidden = jenis.value !== 'website';
          const d = data();
          if (!d.judul || !d.tahun) {
            rawApa.raw = rawIeee.raw = '';
            hasil.innerHTML = `<p class="kosong-cue">${s('kosong')}</p>`;
            return;
          }
          const apa = formatAPA(jenis.value, d);
          const ieee = formatIEEE(jenis.value, d);
          rawApa.raw = polos(apa);
          rawIeee.raw = polos(ieee);
          hasil.innerHTML = `
            <h3>APA 7</h3>
            <p>${keHtml(apa)}</p>
            <h3>IEEE</h3>
            <p>${keHtml(ieee)}</p>`;
        }

        wadah.querySelectorAll('input, textarea, select').forEach((inp) => {
          inp.addEventListener('input', perbarui);
          inp.addEventListener('change', perbarui);
        });

        function pasangSalin(tombol, sumber) {
          tombol.addEventListener('click', async () => {
            if (!sumber.raw) {
              hasil.innerHTML = `<p class="kosong-cue">${s('kosong')}</p>`;
              return;
            }
            try {
              await navigator.clipboard.writeText(sumber.raw);
              tombol.textContent = t('tersalin');
            } catch {
              tombol.textContent = t('salin-gagal');
            }
            setTimeout(() => (tombol.textContent = t('salin')), 1500);
          });
        }

        pasangSalin(q('salin-apa'), rawApa);
        pasangSalin(q('salin-ieee'), rawIeee);
        perbarui();
      },
    });
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', daftar);
  } else {
    // uji mandiri tanpa browser: node tools/daftar-pustaka.js
    const { strictEqual } = require('assert');
    const penulis = 'Sulton, Muhamad Ilham\nPrasetyo, Budi';
    const buku = { penulis, judul: 'Pemrograman Web Dasar', kota: 'Jakarta', penerbit: 'Gramedia', tahun: '2024' };
    const jurnal = {
      penulis, judul: 'Analisis sentimen ulasan aplikasi', jurnal: 'Jurnal Teknologi Informasi',
      volume: '12', nomor: '3', halaman: '12-25', doi: '10.1234/jti.v12i3.567', tahun: '2024',
    };
    strictEqual(
      polos(formatAPA('buku', buku)),
      'Sulton, M. I., & Prasetyo, B. (2024). Pemrograman web dasar. Gramedia.'
    );
    strictEqual(
      polos(formatIEEE('buku', buku)),
      'M. I. Sulton and B. Prasetyo, Pemrograman Web Dasar. Jakarta: Gramedia, 2024.'
    );
    strictEqual(
      polos(formatAPA('jurnal', jurnal)),
      'Sulton, M. I., & Prasetyo, B. (2024). Analisis sentimen ulasan aplikasi. Jurnal Teknologi Informasi, 12(3), 12\u201325. https://doi.org/10.1234/jti.v12i3.567'
    );
    strictEqual(
      polos(formatIEEE('jurnal', jurnal)),
      'M. I. Sulton and B. Prasetyo, "Analisis sentimen ulasan aplikasi," Jurnal Teknologi Informasi, vol. 12, no. 3, pp. 12\u201325, 2024. doi: 10.1234/jti.v12i3.567.'
    );
    const situs = { penulis: 'Pusat Statistik', judul: 'Data terbuka', situs: 'Portal Data', url: 'https://data.go.id', tahun: '2025', akses: '2025-01-02' };
    strictEqual(
      polos(formatAPA('website', situs)),
      'Pusat Statistik. (2025). Data terbuka. Portal Data. https://data.go.id'
    );
    strictEqual(
      polos(formatAPA('website', { judul: 'Kebijakan privasi', situs: 'Situs X', url: 'https://situsx.id', tahun: '2024' })),
      'Kebijakan privasi. (2024). Situs X. https://situsx.id'
    );
    strictEqual(
      polos(formatIEEE('website', situs)),
      'Pusat Statistik, "Data terbuka," Portal Data, 2025. [Online]. Available: https://data.go.id [Accessed: 2025-01-02].'
    );
    strictEqual(
      polos(formatIEEE('website', { ...situs, penulis: '', akses: '' })),
      '"Data terbuka," Portal Data, 2025. [Online]. Available: https://data.go.id'
    );
    strictEqual(doiBersih('https://doi.org/10.1234/x'), '10.1234/x');
    console.log('uji daftar-pustaka: 9/9 lolos');
  }
})();
