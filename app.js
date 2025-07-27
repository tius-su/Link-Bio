// ISI LENGKAP FILE app.js YANG BARU
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
            }

            linksContainer.innerHTML = '';
            if (data.links) {
                data.links.forEach(link => {
                    if (link.isDropdown) {
                        const dropdownContainer = document.createElement('div');
                        dropdownContainer.className = 'dropdown-container';

                        const toggle = document.createElement('a');
                        toggle.href = '#';
                        toggle.className = 'dropdown-toggle';

                        if(link.imageUrl) {
                            const icon = document.createElement('img');
                            icon.src = link.imageUrl;
                            icon.alt = link.title;
                            icon.className = 'link-icon';
                            toggle.appendChild(icon);
                        }

                        const titleSpan = document.createElement('span');
                        titleSpan.textContent = link.title;
                        toggle.appendChild(titleSpan);

                        toggle.onclick = (e) => {
                            e.preventDefault();
                            list.classList.toggle('open');
                        };

                        const list = document.createElement('ul');
                        list.className = 'sublinks-list';

                        if (link.sublinks) {
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
                        }
                        dropdownContainer.appendChild(toggle);
                        dropdownContainer.appendChild(list);
                        linksContainer.appendChild(dropdownContainer);
                    } else {
                        const linkEl = document.createElement('a');
                        linkEl.href = link.url;
                        linkEl.className = 'link-item';
                        linkEl.target = '_blank';

                        if (link.imageUrl) {
                            const icon = document.createElement('img');
                            icon.src = link.imageUrl;
                            icon.alt = link.title;
                            icon.className = 'link-icon';
                            linkEl.appendChild(icon);
                        }
                        
                        const titleSpan = document.createElement('span');
                        titleSpan.textContent = link.title;
                        linkEl.appendChild(titleSpan);

                        linksContainer.appendChild(linkEl);
                    }
                });
            }
        } else {
            displayNameEl.textContent = 'Profil tidak ditemukan.';
        }
    } catch (error) {
        console.error("Error loading profile: ", error);
        displayNameEl.textContent = 'Gagal memuat profil.';
    }
}

document.addEventListener('DOMContentLoaded', loadProfile);
