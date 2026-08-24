let defaultApps = [];

// =========================================================================
// KOTAK SPONSOR: Cukup ketik ID aplikasinya di sini
// =========================================================================
const sponsorIds = [
    'com.fullmoneypro.pinai',
    'com.fullmoney.aquarium_koin',
    'com.whatsapp',
    'com.tokopedia.tkpd',
    'com.sevenlabs.jamuang',
];

// Daftar 10 Kata Sakti (Aman dari banned, mengundang penasaran)
const kataPromosi = [
    "Buat akun di sini",
    "Lihat penawaran spesial",
    "Cari tahu lebih lanjut",
    "Buat akun",
    "Lihat penawaran",
    "Cari tahu",
    "Daftar sekarang",
    "Info selengkapnya",
    "Cek di sini",
    "Lihat selengkapnya"
];

// =========================================================================
// FUNGSI ACAK APLIKASI
// =========================================================================
function acakArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// =========================================================================
// AMBIL DATA DARI APPS.JSON
// =========================================================================
fetch('apps.json')
    .then(res => res.json())
    .then(data => {
        // Otomatis mencarikan data sponsor
        const sponsorApps = sponsorIds.map(id => data.find(app => app.appId === id)).filter(Boolean);
        renderSponsorApps(sponsorApps);

        // Memuat aplikasi reguler
        let appMentah = data.slice(0, 500); 
        
        // MENGACAK APLIKASI POPULER SEBELUM DITAMPILKAN
        defaultApps = acakArray(appMentah); 

        renderApps(defaultApps);
        
        // CATATAN: aktifkanSensorIklan() sudah dihapus total dari sini agar tidak error
    })
    .catch(err => {
        console.log('Gagal memuat data:', err);
        renderSponsorApps([]);
        renderApps([]);
    });

// =========================================================================
// FUNGSI TAMPIL APLIKASI SPONSOR
// =========================================================================
function renderSponsorApps(apps) {
    const container = document.getElementById('wadah-sponsor');
    if (!container) return;
    
    const sponsorBox = container.parentElement;
    container.innerHTML = '';

    if (!apps || apps.length === 0) {
        if (sponsorBox) sponsorBox.style.display = 'none';
        return;
    }

    if (sponsorBox) sponsorBox.style.display = 'block';

    let sponsorHtml = '';
    apps.forEach(app => {
        const iconUrl = app.icon || 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png';
        sponsorHtml += `
            <div class="card">
                <img src="${iconUrl}" 
                     alt="${app.title}"
                     onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/2589/2589175.png';">
                <h3>${app.title}</h3>
                <div class="rating">⭐ ${app.scoreText || app.score || '4.5'}</div>
                <a href="detail.html?id=${app.appId}" class="btn-download">Lihat Detail</a>
            </div>
        `;
    });
    container.innerHTML = sponsorHtml;
}

// =========================================================================
// FUNGSI TAMPIL APLIKASI REGULER + IKLAN DIRECT LINK 10 KATA
// =========================================================================
function renderApps(appsToDisplay) {
    const container = document.getElementById('app-list');
    
    if (!appsToDisplay || appsToDisplay.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">Aplikasi tidak ditemukan.</p>';
        return;
    }

    // Variabel penampung agar render lebih mulus dan tidak hilang
    let htmlContent = '';

    appsToDisplay.forEach((app, index) => {
        const iconUrl = app.icon || 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png';

        // 1. Masukkan data aplikasi
        htmlContent += `
            <div class="card">
                <img src="${iconUrl}" 
                     alt="${app.title}"
                     onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/2589/2589175.png';">
                <h3>${app.title}</h3>
                <div class="rating">⭐ ${app.scoreText || app.score || '4.5'}</div>
                <a href="detail.html?id=${app.appId}" class="btn-download">Lihat Detail</a>
            </div>
        `;

        // 2. Masukkan Slot Iklan setiap 8 aplikasi
        if ((index + 1) % 8 === 0) {
            let indexIklan = Math.floor(index / 8); 
            let teksPromo = kataPromosi[indexIklan % kataPromosi.length]; 
            
            // ---> GANTI TULISAN DI BAWAH INI DENGAN LINK MONETAG BOS <---
            let urlDirectLink = "https://omg10.com/4/11640268";

            htmlContent += `
                <div class="card card-ad" onclick="window.open('${urlDirectLink}', '_blank')" 
                     style="background: linear-gradient(145deg, #e0f2fe, #bae6fd); border: 2px dashed #38bdf8; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; cursor: pointer; transition: transform 0.2s;">
                    
                    <span class="ad-label" style="position: absolute; top: 8px; right: 8px; font-size: 11px; background: #cbd5e1; color: #475569; padding: 2px 6px; border-radius: 4px;">Iklan</span>
                    
                    <h3 style="font-size: 17px; color: #0284c7; font-weight: 800; margin: 15px 0; line-height: 1.3;">
                        ${teksPromo}
                    </h3>
                    
                    <a href="${urlDirectLink}" target="_blank" 
                       style="background: #0ea5e9; color: white; padding: 10px 0; width: 85%; border-radius: 50px; font-size: 14px; font-weight: bold; text-decoration: none; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.4);">
                        Buka Halaman
                    </a>
                </div>
            `;
        }
    });

    // Masukkan ke layar 1x saja agar tidak error
    container.innerHTML = htmlContent;
}

// =========================================================================
// FITUR PENCARIAN
// =========================================================================
const searchInput = document.getElementById('search-input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        const sponsorContainer = document.getElementById('wadah-sponsor');
        const sponsorBox = sponsorContainer ? sponsorContainer.parentElement : null;

        if (keyword === '') {
            if (sponsorBox) sponsorBox.style.display = 'block';
            renderApps(defaultApps);
            return;
        }

        if (sponsorBox) sponsorBox.style.display = 'none';

        const hasilPencarian = defaultApps.filter(app => 
            app.title.toLowerCase().includes(keyword)
        );

        renderApps(hasilPencarian);
    });
}
