
import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ID unik untuk dokumen profil Anda di Firestore.
// Anda bisa menggantinya jika ingin mengelola beberapa profil.
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

            // Terapkan data profil
            profilePicEl.src = data.profileImageUrl || 'https://via.placeholder.com/96';
            displayNameEl.textContent = data.displayName || '@username';

            // Terapkan kustomisasi warna
            document.documentElement.style.setProperty('--bg-color', data.theme.backgroundColor);
            document.documentElement.style.setProperty('--link-bg-color', data.theme.linkBackgroundColor);
            document.documentElement.style.setProperty('--text-color', data.theme.textColor);

            // Render links
            linksContainer.innerHTML = ''; // Kosongkan container
            data.links.forEach(link => {
                if (link.isDropdown) {
                    // Buat dropdown
                    const dropdownContainer = document.createElement('div');
                    dropdownContainer.className = 'dropdown-container';

                    const toggle = document.createElement('a');
                    toggle.href = '#';
                    toggle.className = 'dropdown-toggle';
                    toggle.textContent = link.title;
                    toggle.onclick = (e) => {
                        e.preventDefault();
                        list.classList.toggle('open');
                    };

                    const list = document.createElement('ul');
                    list.className = 'sublinks-list';

                    link.sublinks.forEach(sublink => {
                        const listItem = document.createElement('li');
                        const sublinkAnchor = document.createElement('a');
                        sublinkAnchor.href = sublink.url;
                        sublinkAnchor.textContent = sublink.title;
                        sublinkAnchor.className = 'sublink-item';
                        sublinkAnchor.target = '_blank';
                        listItem.appendChild(sublinkAnchor);
                        list.appendChild(listItem);
                    });

                    dropdownContainer.appendChild(toggle);
                    dropdownContainer.appendChild(list);
                    linksContainer.appendChild(dropdownContainer);

                } else {
                    // Buat link biasa
                    const linkEl = document.createElement('a');
                    linkEl.href = link.url;
                    linkEl.textContent = link.title;
                    linkEl.className = 'link-item';
                    linkEl.target = '_blank'; // Buka di tab baru
                    linksContainer.appendChild(linkEl);
                }
            });

        } else {
            console.log("No such document!");
            displayNameEl.textContent = 'Profil tidak ditemukan.';
        }
    } catch (error) {
        console.error("Error loading profile: ", error);
        displayNameEl.textContent = 'Gagal memuat profil.';
    }
}

document.addEventListener('DOMContentLoaded', loadProfile);

