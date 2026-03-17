const SIDEBAR_ITEMS = [
    { title: 'Dashboard', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>', link: 'dashboard.html' },
    { title: 'Accounts', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>', link: 'accounts.html' },
    { title: 'Transactions', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>', link: 'transactions.html' },
    { title: 'Categories', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>', link: 'categories.html' },
    { title: 'Budgets', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>', link: 'budgets.html' },
    { title: 'Savings Goals', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>', link: 'savings.html' },
];

window.customConfirm = function(message) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = "fixed inset-0 z-[100] flex items-center justify-center";
        modal.innerHTML = `
            <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" id="confirm-bg"></div>
            <div class="relative bg-slate-800 border border-slate-700/50 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl modal-pop text-center">
                <div class="w-16 h-16 bg-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/20">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-white tracking-tight mb-2">Are you sure?</h3>
                <p class="text-sm font-medium text-slate-400 mb-6" id="confirm-msg-text"></p>
                <div class="grid grid-cols-2 gap-4">
                    <button id="confirm-no" class="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-xl text-white font-bold transition-all">Cancel</button>
                    <button id="confirm-yes" class="w-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 py-3 rounded-xl text-white font-bold transition-all">Yes, Delete</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
        // Safe: use textContent (not innerHTML) to prevent XSS from message parameter
        modal.querySelector('#confirm-msg-text').textContent = message;
        const closeIt = (res) => { modal.remove(); resolve(res); };
        modal.querySelector('#confirm-yes').onclick = () => closeIt(true);
        modal.querySelector('#confirm-no').onclick = () => closeIt(false);
        modal.querySelector('#confirm-bg').onclick = () => closeIt(false);
        // Accessibility: allow Escape key to dismiss
        const _esc1 = (e) => { if (e.key === 'Escape') { document.removeEventListener('keydown', _esc1); closeIt(false); } };
        document.addEventListener('keydown', _esc1);
    });
};

window.customAlert = function(message) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = "fixed inset-0 z-[100] flex items-center justify-center";
        modal.innerHTML = `
            <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" id="alert-bg"></div>
            <div class="relative bg-slate-800 border border-slate-700/50 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl modal-pop text-center">
                <div class="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-white tracking-tight mb-2">Notice</h3>
                <p class="text-sm font-medium text-slate-400 mb-6" id="alert-msg-text"></p>
                <button id="alert-ok" class="w-full btn-primary py-3 rounded-xl text-white font-bold transition-all">OK</button>
            </div>`;
        document.body.appendChild(modal);
        // Safe: use textContent (not innerHTML) to prevent XSS
        modal.querySelector('#alert-msg-text').textContent = message;
        const closeIt = () => { modal.remove(); resolve(true); };
        modal.querySelector('#alert-ok').onclick = closeIt;
        modal.querySelector('#alert-bg').onclick = closeIt;
        const _esc2 = (e) => { if (e.key === 'Escape') { document.removeEventListener('keydown', _esc2); closeIt(); } };
        document.addEventListener('keydown', _esc2);
    });
};

function injectSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    // Get current page to set active state
    const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';

    let menuContent = '';
    SIDEBAR_ITEMS.forEach(item => {
        const isActive = currentPath === item.link;
        // active class via styles.css
        const activeClass = isActive ? 'sidebar-item-active' : 'text-slate-400 hover:text-white hover:bg-slate-800/50';
        
        menuContent += `
        <li>
            <a href="${item.link}" class="flex items-center px-6 py-3.5 space-x-4 transition-all duration-200 border-l-transparent border-l-[3px] hover:border-l-indigo-500 ${activeClass}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    ${item.icon}
                </svg>
                <span class="font-medium tracking-wide">${item.title}</span>
            </a>
        </li>`;
    });

    sidebarContainer.innerHTML = `
    <!-- Mobile Overlay -->
    <div id="mobile-sidebar-overlay" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-30 transition-opacity opacity-0 hidden sm:hidden"></div>

    <!-- Sidebar Area: h-screen enables scrolling independently of main body -->
    <aside id="main-sidebar" class="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-40 transition-transform sm:translate-x-0 -translate-x-full">
        <!-- Logo Header -->
        <div class="h-20 flex items-center px-6 border-b border-slate-800">
            <div class="flex items-center space-x-3">
                <div class="bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-lg p-1.5 shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">IshFinance</span>
            </div>
            <button id="close-sidebar-btn" class="sm:hidden ml-auto text-slate-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Scrollable Navigation Area -->
        <div class="flex-1 overflow-y-auto py-6">
            <p class="px-6 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
            <ul class="space-y-1">
                ${menuContent}
            </ul>
        </div>
        
        <!-- User Profile Footer area -->
        <div class="border-t border-slate-800">
            <!-- User card (click goes to settings) -->
            <a href="settings.html" class="flex items-center gap-3 px-4 py-3 mx-2 mt-2 rounded-xl hover:bg-slate-800/60 transition-all group">
                <div class="relative shrink-0">
                    <img id="sidebar-user-avatar" src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
                         alt="Your avatar" class="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/30">
                    <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-white truncate" id="sidebar-user-name">Loading...</p>
                    <p class="text-xs text-slate-500 truncate" id="sidebar-user-email">—</p>
                </div>
                <svg class="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
            <!-- Logout -->
            <div class="px-2 pb-3 pt-1">
                <button id="btn-logout" class="flex items-center w-full px-4 py-2 space-x-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span class="font-medium text-sm">Logout</span>
                </button>
            </div>
        </div>
    </aside>
    `;

    // Inject Hamburger Icon as first direct child of Page Header
    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentHTML('afterbegin', `
            <button id="mobile-menu-btn" class="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none transition-all shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
        `);
    }

    // Sidebar Toggle Logic
    const mainSidebar = document.getElementById('main-sidebar');
    const mobileOverlay = document.getElementById('mobile-sidebar-overlay');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');

    function toggleSidebar() {
        const isClosed = mainSidebar.classList.contains('-translate-x-full');
        if (isClosed) {
            mainSidebar.classList.remove('-translate-x-full');
            mobileOverlay.classList.remove('hidden');
            // short delay for opacity transition to trigger
            setTimeout(() => mobileOverlay.classList.remove('opacity-0'), 10);
        } else {
            mainSidebar.classList.add('-translate-x-full');
            mobileOverlay.classList.add('opacity-0');
            setTimeout(() => mobileOverlay.classList.add('hidden'), 300); // match transition duration
        }
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);
    if (mobileOverlay) mobileOverlay.addEventListener('click', toggleSidebar);

    // Handle logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            if (typeof supabaseClient !== 'undefined') {
                await supabaseClient.auth.signOut();
                window.location.href = 'login.html';
            }
        });
    }

    // Populate sidebar user card
    if (typeof supabaseClient !== 'undefined') {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (!session) return;
            const meta      = session.user.user_metadata || {};
            const firstName = meta.first_name || '';
            const lastName  = meta.last_name  || '';
            const email     = session.user.email || '';
            const fullName  = [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0] || 'User';
            const avatarUrl = meta.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D8ABC&color=fff`;

            const nameEl   = document.getElementById('sidebar-user-name');
            const emailEl  = document.getElementById('sidebar-user-email');
            const avatarEl = document.getElementById('sidebar-user-avatar');

            if (nameEl)   nameEl.textContent   = fullName;
            if (emailEl)  emailEl.textContent  = email;
            if (avatarEl) avatarEl.src          = avatarUrl;
        });
    }
}

// Call on load
document.addEventListener('DOMContentLoaded', injectSidebar);
