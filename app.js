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
            
            profilePicEl.src = data.profileImageUrl || 'https://via.placeholder.com/96';
            displayNameEl.textContent = data.displayName || '@username';

            if (data.theme) {
                document.documentElement.style.setProperty('--bg-color', data.theme.backgroundColor);
                document.documentElement.style.setProperty('--link-bg-color', data.theme.linkBackgroundColor);
                document.documentElement.style.setProperty('--text-color', data.theme.textColor);
                // Terapkan gambar latar
                if (data.theme.backgroundImageUrl) {
                    document.documentElement.style.setProperty('--bg-image', `url('${data.theme.backgroundImageUrl}')`);
                }
            }

            linksContainer.innerHTML = '';
            if (data.links) {
                // Filter untuk mencegah link kosong/tidak valid muncul
                const validLinks = data.links.filter(link => link && link.title);
                
                validLinks.forEach(link => {
                    if (link.isDropdown) {
                        const dropdownContainer = document.createElement('div');
                        dropdownContainer.className = 'dropdown-container';
                        // ... (sisa logika dropdown tidak berubah)
                    } else {
                        if(!link.url) return; // Jangan render jika URL kosong
                        const linkEl = document.createElement('a');
                        linkEl.href = link.url;
                        linkEl.className = 'link-item';
                        linkEl.target = '_blank';
                        // ... (sisa logika link biasa tidak berubah)
                        linksContainer.appendChild(linkEl);
                    }
                });
            }
        } else {
            displayNameEl.textContent = 'Profil tidak ditemukan.';
        }
    } catch (error) {
        displayNameEl.textContent = 'Gagal memuat profil.';
    }
}

document.addEventListener('DOMContentLoaded', loadProfile);
