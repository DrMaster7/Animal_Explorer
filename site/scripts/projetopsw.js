// ======================================================
// projetopsw.js – Navigation + Dummy User Data + Stats
// ======================================================

console.log("projetopsw.js is LOADED!");

// ---------- Dummy User ----------
const DUMMY_USER = {
  name: "João Silva",
  email: "joao@example.com",
  password: "secret123"
};

// ---------- Session Tracking ----------
let sessionStart = Date.now();
let loginCount = 0;
let totalTime = 0;

// Load from localStorage (persists across refreshes)
if (localStorage.getItem('loginCount')) {
  loginCount = parseInt(localStorage.getItem('loginCount'));
  totalTime = parseInt(localStorage.getItem('totalTime'));
}

// ---------- Update Dashboard ----------
function updateDashboard() {
  const nameEl = document.querySelector('#dashboardPage text[font-weight="bold"]');
  const emailEl = document.querySelector('#dashboardPage text[fill="#666"]:nth-of-type(1)');
  const loginEl = document.getElementById('loginCount');
  const timeEl = document.getElementById('totalTime');

  if (nameEl) nameEl.textContent = DUMMY_USER.name;
  if (emailEl) emailEl.textContent = DUMMY_USER.email;
  if (loginEl) loginEl.textContent = `${loginCount} time${loginCount !== 1 ? 's' : ''}`;
  if (timeEl) timeEl.textContent = formatTime(totalTime);
}

function formatTime(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// ---------- Page Switching ----------
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  // Track login when going to main
  if (pageId === 'mainPage') {
    loginCount++;
    localStorage.setItem('loginCount', loginCount);
    sessionStart = Date.now();
    updateDashboard();
  }
}

// Page functions
function showLogin()     { showPage('loginPage'); }
function showSignup()    { showPage('signupPage'); }
function showMain()      { showPage('mainPage'); }
function showDashboard() { showPage('dashboardPage'); updateDashboard(); }
function showActivity()  { showPage('activityPage'); }

// ---------- Back Buttons ----------
document.addEventListener('DOMContentLoaded', () => {
  ['backRectDashboard', 'backTextDashboard'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', showMain);
  });
  ['backRectActivity', 'backTextActivity'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', showMain);
  });
});

// ---------- Footer Links ----------
function attachFooterLinks() {
  const loginLink = document.querySelector('#loginPage .footer-text a');
  const signupLink = document.querySelector('#signupPage .footer-text a');
  if (loginLink) loginLink.onclick = showSignup;
  if (signupLink) signupLink.onclick = showLogin;
}
attachFooterLinks();

// ---------- Nav Buttons ----------
document.addEventListener('DOMContentLoaded', () => {
  const btns = document.querySelectorAll('.nav-button');
  btns[0]?.addEventListener('click', showDashboard);
  btns[1]?.addEventListener('click', showActivity);
});

// ---------- Form Handlers ----------
function handleLogin(e) {
  e.preventDefault();
  alert('Login successful! (demo)');
  clearForms();     // Clears inputs
  showMain();
}

function handleSignup(e) {
  e.preventDefault();
  const pwd = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  if (pwd !== confirm) {
    alert('Passwords do not match!');
    return;
  }
  alert('Account created! (demo)');
  clearForms();     // Clears inputs
  showMain();
}

// Update total time every minute
setInterval(() => {
  if (document.getElementById('mainPage')?.classList.contains('active')) {
    totalTime++;
    localStorage.setItem('totalTime', totalTime);
    updateDashboard();
  }
}, 60000);

function logout() {
  // Optional: Clear session data
  // localStorage.removeItem('loginCount');
  // localStorage.removeItem('totalTime');
  showLogin();
}

document.addEventListener('DOMContentLoaded', () => {
  // ... existing back button code ...

  // LOGOUT BUTTON
  const logoutRect = document.getElementById('logoutBtnRect');
  const logoutText = document.getElementById('logoutBtnText');
  if (logoutRect) logoutRect.addEventListener('click', logout);
  if (logoutText) logoutText.addEventListener('click', logout);
});

// ---------- Clear all form inputs ----------
function clearForms() {
  // Login form
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  if (loginEmail) loginEmail.value = '';
  if (loginPassword) loginPassword.value = '';

  // Signup form
  const signupEmail = document.getElementById('signupEmail');
  const signupPassword = document.getElementById('signupPassword');
  const signupConfirm = document.getElementById('signupConfirm');
  if (signupEmail) signupEmail.value = '';
  if (signupPassword) signupPassword.value = '';
  if (signupConfirm) signupConfirm.value = '';
}


function showSpeciesDetail(species) {
  const headerTitle = document.getElementById('speciesHeaderTitle');
  const contentTitle = document.getElementById('speciesContentTitle');
  const grid = document.getElementById('animalGrid');

  headerTitle.textContent = species;
  contentTitle.textContent = species;
  grid.innerHTML = '';

  const animals = {
    'Mammals': [
      { name: 'Lion', img: 'https://via.placeholder.com/300x180/ddd/000?text=Lion' },
      { name: 'Elephant', img: 'https://via.placeholder.com/300x180/ddd/000?text=Elephant' },
      { name: 'Dog', img: 'https://via.placeholder.com/300x180/ddd/000?text=Dog' },
      { name: 'Cat', img: 'https://via.placeholder.com/300x180/ddd/000?text=Cat' },
      { name: 'Bear', img: 'https://via.placeholder.com/300x180/ddd/000?text=Bear' },
      { name: 'Wolf', img: 'https://via.placeholder.com/300x180/ddd/000?text=Wolf' }
    ],
    'Birds': [
      { name: 'Eagle', img: 'https://via.placeholder.com/300x180/ddd/000?text=Eagle' },
      { name: 'Parrot', img: 'https://via.placeholder.com/300x180/ddd/000?text=Parrot' },
      { name: 'Owl', img: 'https://via.placeholder.com/300x180/ddd/000?text=Owl' }
    ]
    // Add more later
  };

  const list = animals[species] || [];

  list.forEach(animal => {
    const card = document.createElement('div');
    card.className = 'animal-card';
    card.innerHTML = `
      <div class="animal-image" style="background-image: url('${animal.img}');"></div>
      <div class="animal-name">${animal.name}</div>
    `;
    grid.appendChild(card);
  });

  showPage('speciesDetailPage');
}


// Initial update
updateDashboard();

// Export
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.showLogin = showLogin;
window.showSignup = showSignup;
window.showDashboard = showDashboard;
window.showActivity = showActivity;