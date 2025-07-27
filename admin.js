// ISI LENGKAP FILE admin.js YANG BARU
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const USER_ID = "main_profile";

const isLoginPage = window.location.pathname.includes('login.html');
const isAdminPage = window.location.pathname.includes('admin.html');

onAuthStateChanged(auth, user => {
    if (user) {
        if (isLoginPage) {
            window.location.href = './admin.html';
        }
        if (isAdminPage) {
            loadAdminData();
        }
    } else {
        if (isAdminPage) {
            window.location.href = './login.html';
        }
    }
});

if (isLoginPage) {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginError = document.getElementById('login-error');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            loginError.textContent = "Email atau password salah.";
            console.error("Login failed:", error);
        }
    });
}

if (isAdminPage) {
    document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));
    document.getElementById('save-changes-btn').addEventListener('click', saveAdminData);
    document.getElementById('add-new-link-btn').addEventListener('click', () => createLinkEditor());
    
    const publicLink = document.getElementById('public-link');
    const url = new URL('index.html', window.location.href);
    publicLink.href = url.href;
    publicLink.textContent = url.href;
}

async function loadAdminData() {
    const docRef = doc(db, "profiles", USER_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('admin-display-name').value = data.displayName || '';
        document.getElementById('admin-profile-pic-url').value = data.profileImageUrl || '';
        if (data.theme) {
            document.getElementById('bg-color').value = data.theme.backgroundColor || '#ffffff';
            document.getElementById('link-bg-color').value = data.theme.linkBackgroundColor || '#f1f1f1';
            document.getElementById('text-color').value = data.theme.textColor || '#000000';
        }
        
        const linksList = document.getElementById('admin-links-list');
        linksList.innerHTML = '';
        if(data.links) {
            data.links.forEach(link => createLinkEditor(link));
        }
    }
}

function createLinkEditor(linkData = {}) {
    const list = document.getElementById('admin-links-list');
    const entry = document.createElement('div');
    entry.className = 'admin-link-entry';
    const isDropdown = linkData.isDropdown || false;

    entry.innerHTML = `
        <input type="text" class="link-title" placeholder="Judul Link" value="${linkData.title || ''}">
        <input type="url" class="link-image-url" placeholder="URL Gambar Ikon (Opsional)" value="${linkData.imageUrl || ''}">
        <input type="url" class="link-url" placeholder="URL Tujuan" value="${linkData.url || ''}" ${isDropdown ? 'style="display:none;"' : ''}>
        <label>
            <input type="checkbox" class="is-dropdown-checkbox" ${isDropdown ? 'checked' : ''}>
            Jadikan Dropdown?
        </label>
        <div class="sublinks-editor" ${!isDropdown ? 'style="display:none;"' : ''}>
            <h5>Sub-links:</h5>
            <div class="sublinks-list-editor"></div>
            <button type="button" class="add-sublink-btn">+ Tambah Sub-link</button>
        </div>
        <button type="button" class="delete-link-btn">Hapus Link Ini</button>
    `;

    list.appendChild(entry);
    
    const checkbox = entry.querySelector('.is-dropdown-checkbox');
    const urlInput = entry.querySelector('.link-url');
    const sublinksEditor = entry.querySelector('.sublinks-editor');

    checkbox.addEventListener('change', () => {
        urlInput.style.display = checkbox.checked ? 'none' : 'block';
        sublinksEditor.style.display = checkbox.checked ? 'block' : 'none';
    });
    
    entry.querySelector('.delete-link-btn').addEventListener('click', () => entry.remove());

    const sublinksListEditor = entry.querySelector('.sublinks-list-editor');
    if (isDropdown && linkData.sublinks) {
        linkData.sublinks.forEach(sublink => createSublinkEditor(sublinksListEditor, sublink));
    }
    entry.querySelector('.add-sublink-btn').addEventListener('click', () => createSublinkEditor(sublinksListEditor));
}

function createSublinkEditor(container, sublinkData = {}) {
    const subEntry = document.createElement('div');
    subEntry.innerHTML = `
        <input type="text" class="sublink-title" placeholder="Judul Sub-link" value="${sublinkData.title || ''}">
        <input type="url" class="sublink-url" placeholder="URL Sub-link" value="${sublinkData.url || ''}">
        <button type="button" class="delete-sublink-btn">x</button>
    `;
    container.appendChild(subEntry);
    subEntry.querySelector('.delete-sublink-btn').addEventListener('click', () => subEntry.remove());
}

async function saveAdminData() {
    const links = [];
    document.querySelectorAll('.admin-link-entry').forEach(entry => {
        const title = entry.querySelector('.link-title').value;
        const imageUrl = entry.querySelector('.link-image-url').value;
        const isDropdown = entry.querySelector('.is-dropdown-checkbox').checked;

        if (isDropdown) {
            const sublinks = [];
            entry.querySelectorAll('.sublinks-list-editor > div').forEach(subEntry => {
                sublinks.push({
                    title: subEntry.querySelector('.sublink-title').value,
                    url: subEntry.querySelector('.sublink-url').value,
                });
            });
            links.push({ title, imageUrl, isDropdown, sublinks });
        } else {
            const url = entry.querySelector('.link-url').value;
            links.push({ title, url, imageUrl, isDropdown });
        }
    });

    const dataToSave = {
        displayName: document.getElementById('admin-display-name').value,
        profileImageUrl: document.getElementById('admin-profile-pic-url').value,
        theme: {
            backgroundColor: document.getElementById('bg-color').value,
            linkBackgroundColor: document.getElementById('link-bg-color').value,
            textColor: document.getElementById('text-color').value,
        },
        links: links
    };

    try {
        await setDoc(doc(db, "profiles", USER_ID), dataToSave);
        alert('Perubahan berhasil disimpan!');
    } catch (error) {
        console.error("Error saving data: ", error);
        alert('Gagal menyimpan perubahan. Lihat konsol untuk detail.');
    }
}
