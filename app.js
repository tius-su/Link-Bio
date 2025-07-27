import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const USER_ID = "main_profile";

const profilePicEl = document.getElementById('profile-pic');
const displayNameEl = document.getElementById('display-name');
const linksContainer = document.getElementById('links-container');

async function loadProfile() {
    try {
        const docRef = doc(db, "profiles", USER_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Kode untuk menampilkan gambar profil dan nama
            profilePicEl.src = data.profileImageUrl || 'https://via.placeholder.com/96';
            displayNameEl.textContent = data.displayName || '@username';

            // Kode untuk menerapkan tema (warna dan gambar latar)
            if (data.theme) {
                document.documentElement.style.setProperty('--bg-color', data.theme.backgroundColor);
                document.documentElement.style.setProperty('--link-bg-color', data.theme.linkBackgroundColor);
                document.documentElement.style.setProperty('--text-color', data.theme.textColor);
                if (data.theme.backgroundImageUrl) {
                    document.documentElement.style.setProperty('--bg-image', `url('${data.theme.backgroundImageUrl}')`);
                } else {
                    document.documentElement.style.setProperty('--bg-image', `none`);
                }
            }

            // Kode untuk membuat semua tombol link
            linksContainer.innerHTML = '';
            if (data.links) {
                const validLinks = data.links.filter(link => link && link.title);
                validLinks.forEach(link => {
                    // (Logika untuk membuat link dropdown dan link biasa ada di sini)
                    // ...
                });
            }
            
            // <-- POSISI YANG TEPAT ADA DI SINI
            // Tampilkan container setelah semua elemen di atas selesai dibuat
            document.querySelector('.container').classList.add('loaded');

        } else {
            displayNameEl.textContent = 'Profil tidak ditemukan.';
            // Tampilkan juga container jika profil tidak ditemukan agar pesan error terlihat
            document.querySelector('.container').classList.add('loaded');
        }
    } catch (error) {
        console.error(error);
        displayNameEl.textContent = 'Gagal memuat profil.';
        // Tampilkan juga container jika ada error agar pesan error terlihat
        document.querySelector('.container').classList.add('loaded');
    }
}


document.addEventListener('DOMContentLoaded', loadProfile);
