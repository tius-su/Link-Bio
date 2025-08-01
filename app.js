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
                if (data.theme.backgroundImageUrl) {
                    document.documentElement.style.setProperty('--bg-image', `url('${data.theme.backgroundImageUrl}')`);
                } else {
                    document.documentElement.style.setProperty('--bg-image', `none`);
                }
            }

            linksContainer.innerHTML = '';
            if (data.links) {
                const validLinks = data.links.filter(link => link && link.title);
                
                validLinks.forEach(link => {
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
                        
                        const list = document.createElement('ul');
                        list.className = 'sublinks-list';

                        toggle.onclick = (e) => {
                            e.preventDefault();
                            toggle.classList.toggle('open');
                            list.classList.toggle('open');
                        };

                        if (link.sublinks && link.sublinks.length > 0) {
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
                        if(!link.url) return;
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
            
            // Tampilkan container setelah semua elemen di atas selesai dibuat
            document.querySelector('.container').classList.add('loaded');

        } else {
            displayNameEl.textContent = 'Profil tidak ditemukan.';
            document.querySelector('.container').classList.add('loaded');
        }
    } catch (error) {
        console.error(error);
        displayNameEl.textContent = 'Gagal memuat profil.';
        document.querySelector('.container').classList.add('loaded');
    }
}

document.addEventListener('DOMContentLoaded', loadProfile);
