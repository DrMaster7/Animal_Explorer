"use strict";

// =========================
// Funções de navegação
// =========================
function showPage(pageId) {
	document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
	const page = document.getElementById(pageId);
	if (page) page.classList.add('active');
}

window.showToSignup = () => showPage("signupPage");
window.showToLogin = () => showPage("loginPage");
window.showToMain = () => showPage("mainPage");
window.showToDashboard = () => {
	showPage("dashboardPage");	
	window.handleRead();
};

// =========================
// Criação de Conta (Registo)
// =========================
window.handleSignup = (event) => {
	event.preventDefault();
	const name = document.getElementById("signupName").value;
	const email = document.getElementById("signupEmail").value;
	const password = document.getElementById("signupPassword").value;
	const confirm = document.getElementById("signupConfirm").value;
	if (password !== confirm) {
		alert("As palavras-passes não combinam.");
		return;
	}
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "/signup", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			alert("Registo bem-sucedido.");
			window.showToLogin();
		} else if (xhr.readyState === 4) {
			alert("Erro no registo: " + xhr.responseText);
		}
	};
	xhr.send(JSON.stringify({ name: name, email: email, password: password }));
};

// =========================
// Início de Sessão (Login)
// =========================
window.handleLogin = (event) => {
	event.preventDefault();
	const email = document.getElementById("loginEmail").value;
	const password = document.getElementById("loginPassword").value;
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "/login", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			alert("Login bem-sucedido.");
			window.showToMain();
		} else if (xhr.readyState === 4 && xhr.status === 401) {
			alert("Dados inseridos incorretamente.");
		} else if (xhr.readyState === 4) {
			alert("Erro no login: " + xhr.responseText);
		}
	};
	xhr.send(JSON.stringify({ email: email, password: password }));
};

// =========================
// Término de Sessão (Logout)
// =========================
window.handleLogout = () => {
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "/logout", true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			alert("Logout bem-sucedido.");
			if (document.getElementById("dashboardPage")) {
				window.showToLogin();
			}
			if (document.getElementById("mainPage")) {
				window.showToLogin();
			}
		} else if (xhr.readyState === 4) {
			alert("Erro no logout: " + xhr.responseText);
		}
	};
	xhr.send();
};

// =========================
// Ler os dados da conta do utilizador
// =========================
window.handleRead = () => {
	const dashboardElem = document.getElementById("dashboardPage");
	if (!dashboardElem) return;

	const xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	xhr.open("GET", "/user", true);
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				const resp = JSON.parse(xhr.responseText);
				const user = resp.user;
				const nameElem = document.getElementById("userName");
				const emailElem = document.getElementById("userEmail");
				if (nameElem && user.user_name) nameElem.textContent = user.user_name;
				if (emailElem && user.user_email) emailElem.textContent = user.user_email;
			} else {
				alert("Erro ao obter dados do utilizador: " + xhr.responseText);
			}
		}
	};
	xhr.send();
};

// =========================
// Atualizar os dados da conta do utilizador
// =========================
window.handleUpdate = () => {
	const name = document.getElementById("updateName").value.trim();
	const email = document.getElementById("updateEmail").value.trim();
	const newPasswordValue = document.getElementById("updatePassword").value.trim();

	const body = {};
	if (name) body.name = name;
	if (email) body.email = email;
	if (newPasswordValue) body.newPassword = newPasswordValue;

	console.log("Objeto Body antes de enviar:", body);

	if (Object.keys(body).length === 0) {
		alert("Preencha pelo menos um campo (Nome, Email ou Password) para atualizar.");
		return;
	}

	const xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	xhr.open("PUT", "/user", true);
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			let resp = { Message: "Resposta desconhecida do servidor." };
			try {
				resp = JSON.parse(xhr.responseText);
			} catch (e) {
				// ignora
			}

			if (xhr.status === 200) {
				alert(resp.Message || "Dados atualizados com sucesso.");
				toggleUpdateForm(false);
				window.handleRead();
			} else {
				alert("Erro ao atualizar dados: " + (resp.Message || `Erro de rede/servidor (${xhr.status}).`));
			}
		}
	};
	xhr.send(JSON.stringify(body));
};

document.addEventListener('DOMContentLoaded', window.handleRead);

// =========================
// Mostrar e esconder o formulário de atualização dos dados da conta do utilizador
// =========================
window.toggleUpdateForm = (show) => {
	const form = document.getElementById("updateForm");
	if (form) {
		form.style.display = show ? 'block' : 'none';
		if (!show) {
			document.getElementById("updateName").value = '';
			document.getElementById("updateEmail").value = '';
			document.getElementById("updatePassword").value = '';
		}
	}
}

// =========================
// Eliminação da conta do utilizador
// =========================
window.handleDelete = () => {
	const confirmDelete = confirm("Tem a certeza de que deseja eliminar a conta?");
	if (!confirmDelete) return;
	const email = prompt("Introduza o seu email:")
	const password = prompt("Introduza a sua password para confirmar a eliminação da conta:");
	if (!email || !password) {
		alert("Email e password obrigatórias para eliminar a conta.");
		return;
	}
	const xhr = new XMLHttpRequest();
	xhr.open("DELETE", "/delete", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				alert("Conta eliminada com sucesso.");
				window.showToLogin();
			} else {
				alert("Erro a apagar a conta: " + xhr.responseText);
			}
		}
	};
	xhr.send(JSON.stringify({ confirmDelete: true, email: email, password: password }));
};

// =========================
// Verificar sessões existentes
// =========================
window.loginStatus = () => {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", "/check-session", true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			try {
				const resp = JSON.parse(xhr.responseText);
				if (xhr.status === 200 && resp.sessionActive) {
					alert("Bem-vindo de volta.")
					window.showToMain();
				} else if (xhr.status === 401) {
					window.showToLogin();
				} else {
					console.error("Erro ao verificar sessão: " + xhr.responseText);
					window.showToLogin();
				}
			} catch (e) {
				console.error("Erro ao parsear resposta:", e);
				window.showToLogin();
			}
		}
	};
	xhr.send();
};

// =========================
// Dados estáticos dos animais (JSON, para ser transferidos para a BD)
// =========================
const SPECIES_DATA = {
	'Mamíferos': [
		{
			name: 'Leão',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/400px-Lion_waiting_in_Namibia.jpg',
			population: '~20.000',
			status: 'Vulnerável',
			statusClass: 'status-endangered',
			description: 'O leão é um grande felino do género Panthera, nativo de África e da Índia. Conhecido como "rei da selva", vive em grupos familiares chamados alcateias.'
		},
		{
			name: 'Elefante',
			img: 'https://upload.wikimedia.org/wikipedia/commons/3/37/African_Bush_Elephant.jpg',
			population: '~415.000',
			status: 'Vulnerável',
			statusClass: 'status-endangered',
			description: 'O elefante é o maior animal terrestre. Vive em savanas e florestas de África e Ásia, em grupos liderados por fêmeas mais velhas.'
		},
		{
			name: 'Tigre',
			img: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Tiger.50.jpg',
			population: '~3.900',
			status: 'Em perigo',
			statusClass: 'status-endangered',
			description: 'O tigre é o maior felino do mundo. Vive na Ásia e enfrenta ameaças devido à caça furtiva e perda de habitat.'
		}
	],
	'Aves': [
		{
			name: 'Águia-real',
			img: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Aquila_chrysaetos_wildlife.jpg',
			population: 'Desconhecida',
			status: 'Pouco preocupante',
			statusClass: 'status-stable',
			description: 'A águia-real é uma das maiores aves de rapina. Habita zonas montanhosas e é símbolo de força e liberdade.'
		},
		{
			name: 'Pinguim-imperador',
			img: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Emperor_Penguin_Manchot_empereur.jpg',
			population: '~595.000',
			status: 'Quase ameaçado',
			statusClass: 'status-vulnerable',
			description: 'Maior espécie de pinguim, vive na Antártida e é adaptado a condições extremas de frio.'
		}
	],
	'Répteis': [
		{
			name: 'Cobra-real',
			img: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Kingcobra.jpg',
			population: 'Desconhecida',
			status: 'Vulnerável',
			statusClass: 'status-endangered',
			description: 'Maior cobra venenosa do mundo, encontrada no sul e sudeste da Ásia.'
		},
		{
			name: 'Tartaruga-verde',
			img: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Green_turtle_swimming_over_coral_reefs_in_Kona.jpg',
			population: 'Desconhecida',
			status: 'Em perigo',
			statusClass: 'status-endangered',
			description: 'Espécie marinha que percorre longas distâncias nos oceanos tropicais e subtropicais.'
		}
	],
	'Anfíbios': [
		{
			name: 'Sapo-comum',
			img: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Common_toad.jpg',
			population: 'Comum',
			status: 'Pouco preocupante',
			statusClass: 'status-stable',
			description: 'Espécie amplamente distribuída pela Europa, conhecida pela pele rugosa e hábitos noturnos.'
		},
		{
			name: 'Axolote',
			img: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Axolotl_Branco.jpg',
			population: 'Em declínio',
			status: 'Criticamente em perigo',
			statusClass: 'status-endangered',
			description: 'Espécie mexicana conhecida pela capacidade de regeneração e por permanecer em fase larval durante toda a vida.'
		}
	],
	'Peixes': [
		{
			name: 'Tubarão-branco',
			img: 'https://upload.wikimedia.org/wikipedia/commons/5/56/White_shark.jpg',
			population: 'Desconhecida',
			status: 'Vulnerável',
			statusClass: 'status-endangered',
			description: 'Predador marinho de topo encontrado em todos os oceanos temperados.'
		},
		{
			name: 'Cavalo-marinho',
			img: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Hippocampus_zosterae.jpg',
			population: 'Desconhecida',
			status: 'Vulnerável',
			statusClass: 'status-endangered',
			description: 'Peixe pequeno que vive em águas rasas e se caracteriza pelo formato do corpo e pela forma de reprodução única.'
		}
	],
	'Insetos': [
		{
			name: 'Borboleta-monarca',
			img: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Monarch_In_May.jpg',
			population: 'Em declínio',
			status: 'Quase ameaçado',
			statusClass: 'status-vulnerable',
			description: 'Espécie migratória que percorre milhares de quilómetros entre o Canadá e o México.'
		},
		{
			name: 'Abelha-europeia',
			img: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Honeybee_landing_on_flowers.jpg',
			population: 'Comum mas em declínio',
			status: 'Quase ameaçado',
			statusClass: 'status-vulnerable',
			description: 'Importante polinizadora em ecossistemas e agricultura, ameaçada pelo uso de pesticidas e perda de habitat.'
		}
	]
};

// =========================
// Detalhes da espécie
// =========================
let currentSpecies = '';

function showSpeciesDetail(species) {
	currentSpecies = species;

	const headerTitle = document.getElementById('speciesHeaderTitle');
	const contentTitle = document.getElementById('speciesContentTitle');
	const grid = document.getElementById('animalGrid');

	headerTitle.textContent = species;
	contentTitle.textContent = species;
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
}

// =========================
// Perfil do animal
// =========================
function showAnimalProfile(animal) {
	if (!animal) return;

	document.getElementById('animalProfileTitle').textContent = animal.name;
	document.getElementById('animalProfileImage').src = animal.img;
	document.getElementById('animalPopulation').textContent = animal.population || 'Unknown';

	const statusEl = document.getElementById('animalStatus');
	statusEl.textContent = animal.status || 'Unknown';
	statusEl.className = `animal-value ${animal.statusClass || ''}`;

	document.getElementById('animalDescription').textContent = animal.description || 'No description available.';

	showPage('animalProfilePage');
}