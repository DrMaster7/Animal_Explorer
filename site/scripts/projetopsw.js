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

// Track current species for "Voltar"
let currentSpecies = '';

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
  currentSpecies = species;
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
  card.onclick = () => showAnimalProfile(animal);  // CLICK OPENS PROFILE
  card.innerHTML = `
    <div class="animal-image" style="background-image: url('${animal.img}');"></div>
    <div class="animal-name">${animal.name}</div>
  `;
  grid.appendChild(card);
});

  showPage('speciesDetailPage');
}

function showAnimalProfile(animal) {
  const name = animal.name || 'Unknown';
  const img = animal.img || 'https://via.placeholder.com/400';
  const population = animal.population || 'Unknown';
  const status = animal.status || 'Unknown';
  const description = animal.description || 'No description available.';

  // Update header
  document.getElementById('animalProfileName').textContent = name;
  document.getElementById('animalProfileTitle').textContent = name;

  // Update image
  document.getElementById('animalProfileImage').src = img;

  // Update details
  document.getElementById('animalPopulation').textContent = population;
  const statusEl = document.getElementById('animalStatus');
  statusEl.textContent = status;
  statusEl.className = 'animal-value ' + (status.includes('Endangered') || status.includes('Vulnerable') ? 'status-endangered' : 'status-safe');

  // Update description
  document.getElementById('animalDescription').textContent = description;

  showPage('animalProfilePage');
}

// ===========================================
// SPECIES_DATA — ALL SPECIES (NAME + IMG ONLY)
// ===========================================

const SPECIES_DATA = {
  'Mammals': [
    { name: 'Lion', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/400px-Lion_waiting_in_Namibia.jpg' },
    { name: 'Elephant', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/African_Elephant_%28Loxodonta_africana%29_male_%2831755979696%29.jpg/400px-African_Elephant_%28Loxodonta_africana%29_male_%2831755979696%29.jpg' },
    { name: 'Dog', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Golden_retriever_standing_Tucker.jpg/400px-Golden_retriever_standing_Tucker.jpg' },
    { name: 'Cat', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/400px-Cat03.jpg' },
    { name: 'Bear', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/American_Black_Bear_%2819092155893%29.jpg/400px-American_Black_Bear_%2819092155893%29.jpg' },
    { name: 'Wolf', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Gray_wolf_in_British_Columbia.jpg/400px-Gray_wolf_in_British_Columbia.jpg' }
  ],
  'Birds': [
    { name: 'Eagle', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Bald_Eagle_%28Haliaeetus_leucocephalus%29_%28514630612%29.jpg/400px-Bald_Eagle_%28Haliaeetus_leucocephalus%29_%28514630612%29.jpg' },
    { name: 'Parrot', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Scarlet_Macaw_%28Ara_macao%29_%282%29.jpg/400px-Scarlet_Macaw_%28Ara_macao%29_%282%29.jpg' },
    { name: 'Owl', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Great_Horned_Owl_%28Bubo_virginianus%29_%282%29.jpg/400px-Great_Horned_Owl_%28Bubo_virginianus%29_%282%29.jpg' }
  ],
  'Reptiles': [
    { name: 'Crocodile', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Nile_crocodile_%28Crocodylus_niloticus%29_head.jpg/400px-Nile_crocodile_%28Crocodylus_niloticus%29_head.jpg' },
    { name: 'Turtle', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Green_Sea_Turtle_grazing_seagrass.jpg/400px-Green_Sea_Turtle_grazing_seagrass.jpg' },
    { name: 'Snake', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Black_mamba_%28Dendroaspis_polylepis%29.jpg/400px-Black_mamba_%28Dendroaspis_polylepis%29.jpg' }
  ],
  'Amphibians': [
    { name: 'Frog', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Rana_temporaria_%28cropped%29.jpg/400px-Rana_temporaria_%28cropped%29.jpg' },
    { name: 'Salamander', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tiger_Salamander_%28Ambystoma_tigrinum%29.jpg/400px-Tiger_Salamander_%28Ambystoma_tigrinum%29.jpg' },
    { name: 'Newt', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Smooth_newt_%28Lissotriton_vulgaris%29.jpg/400px-Smooth_newt_%28Lissotriton_vulgaris%29.jpg' }
  ],
  'Fish': [
    { name: 'Shark', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Great_white_shark_south_africa.jpg/400px-Great_white_shark_south_africa.jpg' },
    { name: 'Clownfish', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Amphiprion_ocellaris_%28Clown_anemonefish%29_in_Heteractis_magnifica_%28Magnificent_sea_anemone%29.jpg/400px-Amphiprion_ocellaris_%28Clown_anemonefish%29_in_Heteractis_magnifica_%28Magnificent_sea_anemone%29.jpg' },
    { name: 'Tuna', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Atlantic_bluefin_tuna.jpg/400px-Atlantic_bluefin_tuna.jpg' }
  ],
  'Insects': [
    { name: 'Butterfly', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Monarch_Butterfly_Danaus_plexippus_Feeding_Durham_NC_2735.jpg/400px-Monarch_Butterfly_Danaus_plexippus_Feeding_Durham_NC_2735.jpg' },
    { name: 'Bee', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Honey_bee_on_a_dandelion%2C_Sandy%2C_Bedfordshire_%2826585751974%29.jpg/400px-Honey_bee_on_a_dandelion%2C_Sandy%2C_Bedfordshire_%2826585751974%29.jpg' },
    { name: 'Ladybug', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Coccinella_magnifica_%28Red_seven-spot_ladybird%29.jpg/400px-Coccinella_magnifica_%28Red_seven-spot_ladybird%29.jpg' }
  ]
};

// Show Species Detail Page
window.showSpeciesDetail = (species) => {
  currentSpecies = species;
  document.getElementById('speciesHeaderTitle').textContent = species;
  document.getElementById('speciesContentTitle').textContent = species;

  const grid = document.getElementById('animalGrid');
  grid.innerHTML = '';

  const animals = SPECIES_DATA[species] || [];

  animals.forEach(animal => {
    const card = document.createElement('div');
    card.className = 'animal-card';
    card.onclick = () => showAnimalProfile(animal);
    card.innerHTML = `
      <div class="animal-image" style="background-image: url('${animal.img}');"></div>
      <div class="animal-name">${animal.name}</div>
    `;
    grid.appendChild(card);
  });

  showPage('speciesDetailPage');
};

// Show Animal Profile Page (FULL HTML)
window.showAnimalProfile = (animal) => {
  const name = animal.name || 'Unknown';
  const img = animal.img || 'https://via.placeholder.com/400';

  // Update header + title
  document.getElementById('animalProfileName').textContent = name;
  document.getElementById('animalProfileTitle').textContent = name;

  // Update image
  document.getElementById('animalProfileImage').src = img;

  // Placeholder for future data
  document.getElementById('animalPopulation').textContent = 'Loading...';
  document.getElementById('animalStatus').textContent = 'Loading...';
  document.getElementById('animalDescription').textContent = 'Loading...';

  showPage('animalProfilePage');
};

// Reuse your existing showPage
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');
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