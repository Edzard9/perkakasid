(() => {
  const ST = {
    'masukan-json': { id: 'Masukan JSON', en: 'JSON input' },
    format: { id: 'Format', en: 'Format' },
    minify: { id: 'Minify', en: 'Minify' },
    validasi: { id: 'Validasi', en: 'Validate' },
    'json-sah': { id: 'JSON sah.', en: 'Valid JSON.' },
    'json-tak-sah': { id: 'JSON tidak sah: ', en: 'Invalid JSON: ' },
    baris: { id: 'baris', en: 'line' },
    kolom: { id: 'kolom', en: 'column' },
    'belum-hasil': { id: 'Belum ada hasil. Klik Format atau Minify terlebih dahulu.', en: 'No result yet. Click Format or Minify first.' },
    tersalin: { id: 'Hasil tersalin ke papan klip.', en: 'Result copied to the clipboard.' },
    'gagal-salin': { id: 'Gagal menyalin ke papan klip.', en: 'Failed to copy to the clipboard.' },
  };

  function daftar() {
    registerTool({
      id: 'json-formatter',
      nama: 'JSON Formatter',
      namaEn: 'JSON Formatter',
      kategori: 'data',
      ikon: '🧩',
      deskripsi: 'Rapikan, padatkan, dan periksa sah atau tidaknya JSON langsung di browser.',
      deskripsiEn: 'Format, minify, and validate JSON right in your browser.',
      render(wadah) {
        const s = (k) => ST[k][LANG.aktif];
        wadah.innerHTML = `
          <label for="jf-input">${s('masukan-json')}</label>
          <textarea id="jf-input" placeholder='{"nilai": true, "daftar": [1, 2, 3]}'></textarea>
          <div class="aksi">
            <button type="button" id="jf-format">${s('format')}</button>
            <button type="button" id="jf-minify">${s('minify')}</button>
            <button type="button" id="jf-validasi">${s('validasi')}</button>
            <button type="button" id="jf-salin">${t('salin')}</button>
          </div>
          <p class="pesan" id="jf-pesan" hidden></p>
          <pre id="jf-output" class="hasil hasil-pre" hidden></pre>`;

        const input = wadah.querySelector('#jf-input');
        const pesan = wadah.querySelector('#jf-pesan');
        const output = wadah.querySelector('#jf-output');
        let hasil = '';

        function tampilkanPesan(teks, jenis) {
          pesan.hidden = false;
          pesan.className = `pesan ${jenis}`;
          pesan.textContent = teks;
        }

        function posisiError(e) {
          const m = e.message.match(/position (\d+)/);
          if (!m) return e.message;
          const sebelum = input.value.slice(0, Number(m[1]));
          const baris = (sebelum.match(/\n/g) || []).length + 1;
          const kolom = sebelum.length - sebelum.lastIndexOf('\n');
          return `${e.message} (${s('baris')} ${baris}, ${s('kolom')} ${kolom})`;
        }

        function proses(minify) {
          try {
            const data = JSON.parse(input.value);
            hasil = JSON.stringify(data, null, minify ? 0 : 2);
            output.hidden = false;
            output.textContent = hasil;
            tampilkanPesan(s('json-sah'), 'ok');
          } catch (e) {
            hasil = '';
            output.hidden = true;
            tampilkanPesan(`${s('json-tak-sah')}${posisiError(e)}`, 'gagal');
          }
        }

        wadah.querySelector('#jf-format').addEventListener('click', () => proses(false));
        wadah.querySelector('#jf-minify').addEventListener('click', () => proses(true));
        wadah.querySelector('#jf-validasi').addEventListener('click', () => {
          try {
            JSON.parse(input.value);
            tampilkanPesan(s('json-sah'), 'ok');
          } catch (e) {
            tampilkanPesan(`${s('json-tak-sah')}${posisiError(e)}`, 'gagal');
          }
        });
        wadah.querySelector('#jf-salin').addEventListener('click', async () => {
          if (!hasil) {
            tampilkanPesan(s('belum-hasil'), 'gagal');
            return;
          }
          try {
            await navigator.clipboard.writeText(hasil);
            tampilkanPesan(s('tersalin'), 'ok');
          } catch {
            tampilkanPesan(s('gagal-salin'), 'gagal');
          }
        });
      },
    });
  }

  document.addEventListener('DOMContentLoaded', daftar);
})();
