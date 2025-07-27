import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("✅ app.js loaded successfully.");

const USER_ID = "main_profile";

const profilePicEl = document.getElementById('profile-pic');
const displayNameEl = document.getElementById('display-name');
const linksContainer = document.getElementById('links-container');

async function loadProfile() {
    console.log("⏳ Attempting to load profile for USER_ID:", USER_ID);
    try {
        const docRef = doc(db, "profiles", USER_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("✔️ Document found!", docSnap.data());
            const data = docSnap.data();

            profilePicEl.src = data.profileImageUrl || 'https://via.placeholder.com/96';
            displayNameEl.textContent = data.displayName || '@username';

            document.documentElement.style.setProperty('--bg-color', data.theme.backgroundColor);
            document.documentElement.style.setProperty('--link-bg-color', data.theme.linkBackgroundColor);
            document.documentElement.style.setProperty('--text-color', data.theme.textColor);

            linksContainer.innerHTML = '';
            data.links.forEach(link => {
                if (link.isDropdown) {
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
                    const linkEl = document.createElement('a');
                    linkEl.href = link.url;
                    linkEl.textContent = link.title;
                    linkEl.className = 'link-item';
                    linkEl.target = '_blank';
                    linksContainer.appendChild(linkEl);
                }
            });

        } else {
            console.log("❌ Document not found! Check if USER_ID and collection name are correct.");
        }
    } catch (error) {
        console.error("🔥 Error caught while loading profile: ", error);
        displayNameEl.textContent = 'Gagal memuat profil.';
    }
}

document.addEventListener('DOMContentLoaded', loadProfile);
