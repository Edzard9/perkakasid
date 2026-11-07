// Dukungan dua bahasa: state bahasa aktif, kamus string UI, dan penerapannya ke kerangka halaman.
const LANG = {
  aktif: localStorage.getItem('perkakasid-lang') === 'en' ? 'en' : 'id',
  set(b) {
    this.aktif = b;
    localStorage.setItem('perkakasid-lang', b);
  },
};

const KAMUS = {
  judul: { id: 'PerkakasID - Perkakas digital orang Indonesia', en: 'PerkakasID - Digital tools for Indonesians' },
  tagline: { id: 'Perkakas digital orang Indonesia', en: 'Digital tools for Indonesians' },
  'cari-label': { id: 'Cari tool', en: 'Search tools' },
  'cari-placeholder': { id: 'Ketik nama atau jenis tool, misal: terbilang', en: 'Type a tool name or kind, e.g. number to words' },
  'filter-kategori': { id: 'Filter kategori tool', en: 'Filter tools by category' },
  'kategori-semua': { id: 'Semua', en: 'All' },
  kosong: { id: 'Tidak ada tool yang cocok. Coba kata kunci atau kategori lain.', en: 'No matching tools. Try another keyword or category.' },
  kembali: { id: 'Kembali ke daftar tool', en: 'Back to the tool list' },
  'footer-catatan': { id: 'Semua tool berjalan sepenuhnya di browser Anda. Data yang Anda masukkan tidak pernah dikirim ke server.', en: 'All tools run entirely in your browser. The data you enter is never sent to a server.' },
  'tool-tak-ada': { id: 'Tool tidak ditemukan', en: 'Tool not found' },
  'tool-tak-ada-cue': { id: 'Tautan mungkin salah atau tool belum ada. Coba kembali ke daftar tool.', en: 'The link may be wrong or the tool does not exist yet. Go back to the tool list.' },
  salin: { id: 'Salin hasil', en: 'Copy result' },
  tersalin: { id: 'Tersalin!', en: 'Copied!' },
  'salin-gagal': { id: 'Gagal menyalin', en: 'Copy failed' },
  cetak: { id: 'Cetak', en: 'Print' },
  hasilkan: { id: 'Hasilkan', en: 'Generate' },
  'tambah-baris': { id: 'Tambah Baris', en: 'Add Row' },
  hapus: { id: 'Hapus', en: 'Delete' },
};

const KATEGORI = {
  kuliah: { id: 'Kuliah dan Akademik', en: 'Study and Academics' },
  uang: { id: 'Uang dan Usaha', en: 'Money and Business' },
  teks: { id: 'Teks dan Bahasa', en: 'Text and Language' },
  dokumen: { id: 'Dokumen dan Kerja', en: 'Documents and Work' },
  data: { id: 'Data dan Developer', en: 'Data and Developer' },
  sehari: { id: 'Sehari-hari', en: 'Everyday Life' },
};

const t = (k) => KAMUS[k][LANG.aktif];
const tKategori = (k) => KATEGORI[k][LANG.aktif];
const lokal = () => (LANG.aktif === 'id' ? 'id-ID' : 'en-US');

function terapkanBahasa() {
  document.documentElement.lang = LANG.aktif;
  const ganti = (id, teks) => { document.getElementById(id).textContent = teks; };
  ganti('tagline', t('tagline'));
  ganti('label-cari', t('cari-label'));
  document.getElementById('input-cari').placeholder = t('cari-placeholder');
  document.getElementById('kategori').setAttribute('aria-label', t('filter-kategori'));
  ganti('kosong', t('kosong'));
  ganti('tautan-kembali', t('kembali'));
  ganti('footer-catatan', t('footer-catatan'));
  document.querySelectorAll('#ganti-bahasa [data-bahasa]').forEach((b) => {
    const aktif = b.dataset.bahasa === LANG.aktif;
    b.classList.toggle('aktif', aktif);
    b.setAttribute('aria-pressed', String(aktif));
  });
}

function gantiBahasa(b) {
  if (b === LANG.aktif) return;
  LANG.set(b);
  terapkanBahasa();
  dispatchEvent(new CustomEvent('ubah-bahasa'));
}

document.addEventListener('DOMContentLoaded', () => {
  terapkanBahasa();
  document.getElementById('ganti-bahasa').addEventListener('click', (e) => {
    const b = e.target.closest('[data-bahasa]');
    if (b) gantiBahasa(b.dataset.bahasa);
  });
});
