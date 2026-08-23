const urlParams = new URLSearchParams(window.location.search);
const appId = urlParams.get('id');

// Ubah fetch ke apps.json (karena web di GitHub tidak punya backend /api/detail)
fetch('apps.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('detail-content');

        // Cari aplikasi di dalam apps.json yang ID-nya sama dengan yang diklik
        const app = data.find(item => item.appId === appId);

        // Kalau aplikasinya tidak ada di apps.json
        if (!app) {
            container.innerHTML = '<h2>Aplikasi tidak ditemukan!</h2>';
            return;
        }

        // Kalau aplikasinya ketemu, ubah judul tab browser
        document.title = `${app.title} - apk.legal`;

        // Tampilkan desain detail aplikasi Anda (HTML tidak saya ubah, tetap pakai desain Anda)
        container.innerHTML = `
            <div class="detail-header">
                <img src="${app.icon}" alt="${app.title}">
                <div class="detail-info">
                    <h1>${app.title}</h1>
                    <p class="developer"><span>${app.developer || 'Official Developer'}</span></p>
                    <p class="rating">⭐ ${app.scoreText || app.score || '4.5'}</p>
                    <a href="${app.url}" target="_blank" class="btn-download-large">Download</a>
                </div>
            </div>

            <div class="detail-body">
                <h3>Deskripsi Lengkap</h3>
                <div class="full-description" style="line-height: 1.6; color: #334155; margin-top: 15px;">
                    ${app.descriptionHTML || app.description || app.summary || 'Tidak ada deskripsi.'}
                </div>
            </div>
        `;
    })
    .catch((error) => {
        console.error("Error:", error);
        document.getElementById('detail-content').innerHTML = '<h2>Gagal memuat detail aplikasi.</h2>';
    });
