const TOOLS = [];

function registerTool(tool) {
  TOOLS.push(tool);
}

const el = (id) => document.getElementById(id);
const pilihNama = (tool) => (LANG.aktif === 'en' ? tool.namaEn : tool.nama);
const pilihDeskripsi = (tool) => (LANG.aktif === 'en' ? tool.deskripsiEn : tool.deskripsi);
let kategoriAktif = 'semua';

function renderKategori() {
  const daftar = ['semua', ...new Set(TOOLS.map((x) => x.kategori))];
  el('kategori').innerHTML = daftar.map((k) => {
    const label = k === 'semua' ? t('kategori-semua') : tKategori(k);
    return `<button type="button" class="chip${k === kategoriAktif ? ' aktif' : ''}" aria-pressed="${k === kategoriAktif}" data-kategori="${k}">${label}</button>`;
  }).join('');
}

function renderGrid() {
  const q = el('input-cari').value.trim().toLowerCase();
  const cocok = TOOLS.filter((x) =>
    (kategoriAktif === 'semua' || x.kategori === kategoriAktif) &&
    (!q || `${x.nama} ${x.deskripsi} ${x.namaEn || ''} ${x.deskripsiEn || ''}`.toLowerCase().includes(q))
  );
  el('grid-tool').innerHTML = cocok.map((x) =>
    `<a class="kartu" href="#/${x.id}">
      <span class="ikon" aria-hidden="true">${x.ikon}</span>
      <h3>${pilihNama(x)}</h3>
      <p>${pilihDeskripsi(x)}</p>
      <span class="tag">${tKategori(x.kategori)}</span>
    </a>`
  ).join('');
  el('kosong').hidden = cocok.length > 0;
}

function renderBeranda() {
  document.title = t('judul');
  el('beranda').hidden = false;
  el('area-tool').hidden = true;
  document.body.classList.remove('ada-tool');
  renderKategori();
  renderGrid();
}

function bukaTool(id) {
  const tool = TOOLS.find((x) => x.id === id);
  el('beranda').hidden = true;
  el('area-tool').hidden = false;
  document.body.classList.add('ada-tool');
  const isi = el('isi-tool');
  isi.innerHTML = '';
  if (!tool) {
    document.title = `${t('tool-tak-ada')} - PerkakasID`;
    isi.innerHTML = `<h2>${t('tool-tak-ada')}</h2><p>${t('tool-tak-ada-cue')}</p>`;
    return;
  }
  document.title = `${pilihNama(tool)} - PerkakasID`;
  isi.innerHTML = `<h2>${pilihNama(tool)}</h2><p class="meta">${tKategori(tool.kategori)}</p>`;
  tool.render(isi);
}

function route() {
  const id = location.hash.slice(1).replace(/^\//, '');
  if (id) bukaTool(decodeURIComponent(id));
  else renderBeranda();
  scrollTo(0, 0);
}

addEventListener('hashchange', route);
addEventListener('ubah-bahasa', route);
// ponytail: ganti bahasa me-render ulang dan mengosongkan input tool yang terbuka; simpan-restore nilai saat tool mulai punya state sendiri
el('input-cari').addEventListener('input', renderGrid);
el('kategori').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  kategoriAktif = chip.dataset.kategori;
  renderKategori();
  renderGrid();
});

// route pertama menunggu DOMContentLoaded agar TOOLS sudah terisi oleh script tools yang dimuat lebih dulu
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', route);
else route();

if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
