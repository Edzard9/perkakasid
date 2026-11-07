(() => {
  const KATA = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
  const EKATA = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const EPULUH = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const SKALA_EN = [[1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']];

  function sisa(angka, basis) {
    const r = angka % basis;
    return r ? ' ' + keKata(r) : '';
  }

  function keKata(angka) {
    angka = Math.floor(angka);
    if (angka < 12) return KATA[angka];
    if (angka < 20) return keKata(angka - 10) + ' belas';
    if (angka < 100) return keKata(Math.floor(angka / 10)) + ' puluh' + sisa(angka, 10);
    if (angka < 200) return 'seratus' + sisa(angka, 100);
    if (angka < 1000) return keKata(Math.floor(angka / 100)) + ' ratus' + sisa(angka, 100);
    if (angka < 2000) return 'seribu' + sisa(angka, 1000);
    if (angka < 1e6) return keKata(Math.floor(angka / 1000)) + ' ribu' + sisa(angka, 1000);
    if (angka < 1e9) return keKata(Math.floor(angka / 1e6)) + ' juta' + sisa(angka, 1e6);
    if (angka < 1e12) return keKata(Math.floor(angka / 1e9)) + ' miliar' + sisa(angka, 1e9);
    return keKata(Math.floor(angka / 1e12)) + ' triliun' + sisa(angka, 1e12);
  }

  function sisaEn(angka, basis) {
    const r = angka % basis;
    return r ? ' ' + keKataEn(r) : '';
  }

  // Gaya Amerika sederhana: tanpa "and" dan tanpa tanda hubung.
  function keKataEn(angka) {
    angka = Math.floor(angka);
    if (angka < 20) return EKATA[angka];
    if (angka < 100) return EPULUH[Math.floor(angka / 10)] + (angka % 10 ? ' ' + EKATA[angka % 10] : '');
    if (angka < 1000) return EKATA[Math.floor(angka / 100)] + ' hundred' + sisaEn(angka, 100);
    for (const [basis, skala] of SKALA_EN) {
      if (angka >= basis) return keKataEn(Math.floor(angka / basis)) + ' ' + skala + sisaEn(angka, basis);
    }
    return EKATA[angka];
  }

  const ST = {
    angka: { id: 'Angka', en: 'Number' },
    placeholder: { id: 'misal: 2500000 atau 2.500.000', en: 'e.g. 2500000 or 2,500,000' },
    'bahasa-hasil': { id: 'Bahasa hasil', en: 'Output language' },
    'mode-rupiah': { id: 'Mode rupiah (tambahkan kata rupiah)', en: 'Rupiah mode (adds the word rupiah)' },
    kosong: { id: 'Ketik angka di atas untuk melihat terbilangnya.', en: 'Type a number above to see it in words.' },
    maks: { id: 'Maksimal', en: 'Max' },
    digit: { id: 'digit (hingga ratusan triliun).', en: 'digits (up to hundreds of trillions).' },
  };

  function daftar() {
    registerTool({
      id: 'terbilang',
      nama: 'Terbilang Rupiah',
      namaEn: 'Number to Words',
      kategori: 'uang',
      ikon: '💰',
      deskripsi: 'Ubah angka menjadi kata terbilang rupiah, siap dipakai untuk nota dan kwitansi.',
      deskripsiEn: 'Turn numbers into Indonesian words for invoices and receipts, or into plain English number words.',
      render(wadah) {
        const s = (k) => ST[k][LANG.aktif];
        wadah.innerHTML = `
          <label for="tb-angka">${s('angka')}</label>
          <input id="tb-angka" type="text" inputmode="numeric" autocomplete="off" placeholder="${s('placeholder')}">
          <label for="tb-bahasa">${s('bahasa-hasil')}</label>
          <select id="tb-bahasa">
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
          <label class="opsi"><input type="checkbox" id="tb-rupiah" checked> ${s('mode-rupiah')}</label>
          <div class="aksi">
            <button type="button" id="tb-salin">${t('salin')}</button>
          </div>
          <div class="hasil" id="tb-hasil" aria-live="polite"></div>`;

        const input = wadah.querySelector('#tb-angka');
        const bahasa = wadah.querySelector('#tb-bahasa');
        const rupiah = wadah.querySelector('#tb-rupiah');
        const hasil = wadah.querySelector('#tb-hasil');
        const salin = wadah.querySelector('#tb-salin');
        let teksHasil = '';
        // ponytail: angka bulat saja, sen dan desimal belum didukung; batas atas 15 digit (ratusan triliun), naikkan dengan BigInt bila perlu
        const BATAS_DIGIT = 15;

        function sinkronOpsi() {
          rupiah.closest('label').hidden = bahasa.value !== 'id';
        }

        wadah.querySelectorAll('input').forEach((inp) => inp.addEventListener('input', perbarui));
        bahasa.addEventListener('change', () => { sinkronOpsi(); perbarui(); });
        bahasa.value = LANG.aktif;
        sinkronOpsi();

        function perbarui() {
          const angka = input.value.replace(/\D/g, '');
          if (angka.length > BATAS_DIGIT) {
            teksHasil = '';
            hasil.innerHTML = `<p class="pesan gagal">${s('maks')} ${BATAS_DIGIT} ${s('digit')}</p>`;
            return;
          }
          if (!angka) {
            teksHasil = '';
            hasil.innerHTML = `<p class="kosong-cue">${s('kosong')}</p>`;
            return;
          }
          const n = Number(angka);
          const pakaiRupiah = bahasa.value === 'id' && rupiah.checked;
          teksHasil = bahasa.value === 'id' ? keKata(n) + (pakaiRupiah ? ' rupiah' : '') : keKataEn(n);
          const angkaTampil = n.toLocaleString(bahasa.value === 'id' ? 'id-ID' : 'en-US');
          hasil.innerHTML = `
            ${bahasa.value === 'id' && pakaiRupiah ? `<p class="hasil-utama">Rp${angkaTampil}</p>` : ''}
            ${bahasa.value === 'en' ? `<p class="hasil-utama">${angkaTampil}</p>` : ''}
            <p>${teksHasil}</p>`;
        }

        salin.addEventListener('click', async () => {
          if (!teksHasil) {
            hasil.innerHTML = `<p class="kosong-cue">${ST.kosong[LANG.aktif]}</p>`;
            return;
          }
          try {
            await navigator.clipboard.writeText(teksHasil);
            salin.textContent = t('tersalin');
          } catch {
            salin.textContent = t('salin-gagal');
          }
          setTimeout(() => (salin.textContent = t('salin')), 1500);
        });

        perbarui();
      },
    });
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', daftar);
  } else {
    // uji mandiri tanpa browser: node tools/terbilang.js
    const { strictEqual } = require('assert');
    const uji = [
      [0, 'nol'],
      [7, 'tujuh'],
      [11, 'sebelas'],
      [15, 'lima belas'],
      [20, 'dua puluh'],
      [25, 'dua puluh lima'],
      [100, 'seratus'],
      [101, 'seratus satu'],
      [400, 'empat ratus'],
      [999, 'sembilan ratus sembilan puluh sembilan'],
      [1000, 'seribu'],
      [1001, 'seribu satu'],
      [2000, 'dua ribu'],
      [11000, 'sebelas ribu'],
      [111000, 'seratus sebelas ribu'],
      [1000000, 'satu juta'],
      [1100000, 'satu juta seratus ribu'],
      [1000000000, 'satu miliar'],
      [1234567890, 'satu miliar dua ratus tiga puluh empat juta lima ratus enam puluh tujuh ribu delapan ratus sembilan puluh'],
      [1000000000000, 'satu triliun'],
      [2000000000005, 'dua triliun lima'],
    ];
    uji.forEach(([angka, jawaban]) => strictEqual(keKata(angka), jawaban, `${angka} => ${keKata(angka)}`));
    const ujiEn = [
      [0, 'zero'],
      [7, 'seven'],
      [15, 'fifteen'],
      [20, 'twenty'],
      [25, 'twenty five'],
      [101, 'one hundred one'],
      [999, 'nine hundred ninety nine'],
      [1000, 'one thousand'],
      [1001, 'one thousand one'],
      [11000, 'eleven thousand'],
      [1000000, 'one million'],
      [1234567890, 'one billion two hundred thirty four million five hundred sixty seven thousand eight hundred ninety'],
      [1000000000000, 'one trillion'],
      [2000000000005, 'two trillion five'],
    ];
    ujiEn.forEach(([angka, jawaban]) => strictEqual(keKataEn(angka), jawaban, `${angka} => ${keKataEn(angka)}`));
    console.log(`uji terbilang: id ${uji.length}/${uji.length}, en ${ujiEn.length}/${ujiEn.length} lolos`);
  }
})();
