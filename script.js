let defaultApps = [];

// =========================================================================
// KOTAK SPONSOR: Cukup ketik ID aplikasinya di sini, pastikan sudah ada di apps.json!
// =========================================================================
const sponsorIds = [
    'com.fullmoneypro.pinai',
    'com.fullmoney.aquarium_koin',
    'com.whatsapp',
    'com.tokopedia.tkpd',
    'com.sevenlabs.jamuang',
];

// =========================================================================
// KODE BARU: Fungsi untuk mengacak urutan aplikasi (Fisher-Yates Shuffle)
// =========================================================================
function acakArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Memuat data dari apps.json lokal secara aman dan permanen
fetch('apps.json')
    .then(res => res.json())
    .then(data => {
        // Otomatis mencarikan data sponsor berdasarkan ID di atas dari file apps.json
        const sponsorApps = sponsorIds.map(id => data.find(app => app.appId === id)).filter(Boolean);
        renderSponsorApps(sponsorApps);

        // Memuat 100 aplikasi reguler di bawah untuk pengunjung
        let appMentah = data.slice(0, 500); 
        
        // MENGACAK APLIKASI POPULER SEBELUM DITAMPILKAN
        defaultApps = acakArray(appMentah); 

        renderApps(defaultApps);
        aktifkanSensorIklan();
    })
    .catch(err => {
        console.log('Gagal memuat data:', err);
        renderSponsorApps([]);
        renderApps([]);
    });

// Fungsi Menampilkan Aplikasi Sponsor di Kotak Kuning
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

    apps.forEach(app => {
        const iconUrl = app.icon || 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png';
        container.innerHTML += `
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
}

// Fungsi Menampilkan 200+ Aplikasi Reguler
function renderApps(appsToDisplay) {
    const container = document.getElementById('app-list');
    container.innerHTML = '';

    if (!appsToDisplay || appsToDisplay.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">Aplikasi tidak ditemukan.</p>';
        return;
    }

    appsToDisplay.forEach((app, index) => {
        const iconUrl = app.icon || 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png';

        container.innerHTML += `
            <div class="card">
                <img src="${iconUrl}" 
                     alt="${app.title}"
                     onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/2589/2589175.png';">
                <h3>${app.title}</h3>
                <div class="rating">⭐ ${app.scoreText || app.score || '4.5'}</div>
                <a href="detail.html?id=${app.appId}" class="btn-download">Lihat Detail</a>
            </div>
        `;

        // Slot Iklan Natif setiap 8 kartu (Iklan tetap di posisinya)
        if ((index + 1) % 8 === 0) {
            container.innerHTML += `
                <div class="card card-ad lazy-ad-slot" data-status="menunggu">
                    <span class="ad-label">Iklan</span>
                    <div class="ad-placeholder" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">
                        <p style="color:#94a3b8; font-size:12px;">Memuat Iklan...</p>
                    </div>
                </div>
            `;
        }
    });
}

// =========================================================================
// MESIN SENSOR IKLAN LAZY LOADING (KHUSUS MONETAG/ADS NETWORK)
// =========================================================================
function aktifkanSensorIklan() {
    const semuaKotakIklan = document.querySelectorAll('.lazy-ad-slot');

    // Mengecek apakah browser pengunjung mendukung fitur sensor (IntersectionObserver)
    if ('IntersectionObserver' in window) {
        
        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                // Jika kotak iklan sudah mulai masuk/mendekati layar HP/Monitor
                if (entry.isIntersecting) {
                    let kotak = entry.target;
                    
                    // Pastikan iklannya belum pernah diload
                    if (kotak.dataset.status === 'menunggu') {
                        muatIklanMonetag(kotak);
                        kotak.dataset.status = 'selesai'; // Kunci supaya gak diload 2 kali
                        observer.unobserve(kotak); // Matikan sensor untuk kotak ini
                    }
                }
            });
        }, {
            rootMargin: '300px', // PENTING: Load iklan saat jaraknya 300 pixel sebelum masuk layar (biar mulus dan gak kelihatan loading)
            threshold: 0
        });

        // Pasang sensor ke semua kotak iklan yang ada di web
        semuaKotakIklan.forEach(function(kotak) {
            observer.observe(kotak);
        });

    } else {
        // Jika browser pengunjung sangat jadul, load semua iklan sekaligus (fallback)
        semuaKotakIklan.forEach(function(kotak) {
            muatIklanMonetag(kotak);
        });
    }
}

// =========================================================================
// FUNGSI UNTUK MEMASUKKAN KODE MONETAG KE DALAM KOTAK
// =========================================================================
function muatIklanMonetag(kotak) {
    const tempatIklan = kotak.querySelector('.ad-placeholder');
    tempatIklan.innerHTML = ''; // Hapus tulisan "Memuat Iklan..."

    // ---> NANTI BOS MASUKKAN KODE SCRIPT DARI MONETAG DI SINI <---
    // Contoh cara memasukkan script dari pihak ketiga:
    
    const scriptIklan = document.createElement('script');
    scriptIklan.async = true;
    
    // Ganti URL ini dengan URL script Natif yang diberikan Monetag nanti
    scriptIklan.src = "https://kodenya-monetag.com/script-iklan-natif.js"; 
    
    tempatIklan.appendChild(scriptIklan);
}
// Fitur Pencarian Lokal (Cari cepat khusus di dalam web)
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
