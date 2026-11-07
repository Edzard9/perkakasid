(() => {
  const WAKTU_BACA_KPM = 200;

  const ST = {
    teks: { id: 'Teks', en: 'Text' },
    placeholder: { id: 'Tulis atau tempel teks di sini, statistik muncul otomatis.', en: 'Type or paste text here, the stats update as you type.' },
    kata: { id: 'Kata', en: 'Words' },
    karakter: { id: 'Karakter', en: 'Characters' },
    'tanpa-spasi': { id: 'Karakter tanpa spasi', en: 'Characters without spaces' },
    kalimat: { id: 'Kalimat', en: 'Sentences' },
    paragraf: { id: 'Paragraf', en: 'Paragraphs' },
    baca: { id: 'Waktu baca', en: 'Reading time' },
    menit: { id: 'menit', en: 'min' },
  };

  function daftar() {
    registerTool({
      id: 'penghitung-kata',
      nama: 'Penghitung Kata',
      namaEn: 'Word Counter',
      kategori: 'teks',
      ikon: '📝',
      deskripsi: 'Hitung kata, karakter, kalimat, paragraf, dan perkiraan waktu baca saat Anda mengetik.',
      deskripsiEn: 'Count words, characters, sentences, paragraphs, and estimated reading time as you type.',
      render(wadah) {
        const s = (k) => ST[k][LANG.aktif];
        wadah.innerHTML = `
          <label for="pk-teks">${s('teks')}</label>
          <textarea id="pk-teks" placeholder="${s('placeholder')}"></textarea>
          <dl class="stat">
            <div><dt>${s('kata')}</dt><dd id="pk-kata">0</dd></div>
            <div><dt>${s('karakter')}</dt><dd id="pk-karakter">0</dd></div>
            <div><dt>${s('tanpa-spasi')}</dt><dd id="pk-tanpa-spasi">0</dd></div>
            <div><dt>${s('kalimat')}</dt><dd id="pk-kalimat">0</dd></div>
            <div><dt>${s('paragraf')}</dt><dd id="pk-paragraf">0</dd></div>
            <div><dt>${s('baca')}</dt><dd id="pk-baca">0 ${s('menit')}</dd></div>
          </dl>`;

        const teks = wadah.querySelector('#pk-teks');
        const tampil = (id, nilai) => (wadah.querySelector(id).textContent = nilai);

        function perbarui() {
          const x = teks.value;
          const kata = x.trim() ? x.trim().split(/\s+/).length : 0;
          const angka = (n) => n.toLocaleString(lokal());
          tampil('#pk-kata', angka(kata));
          tampil('#pk-karakter', angka(x.length));
          tampil('#pk-tanpa-spasi', angka(x.replace(/\s/g, '').length));
          tampil('#pk-kalimat', angka(x.split(/[.!?]+/).map((y) => y.trim()).filter(Boolean).length));
          tampil('#pk-paragraf', angka(x.split(/\n+/).map((y) => y.trim()).filter(Boolean).length));
          tampil('#pk-baca', kata ? `${LANG.aktif === 'id' ? '±' : '~'}${Math.ceil(kata / WAKTU_BACA_KPM)} ${s('menit')}` : `0 ${s('menit')}`);
        }

        teks.addEventListener('input', perbarui);
      },
    });
  }

  document.addEventListener('DOMContentLoaded', daftar);
})();
