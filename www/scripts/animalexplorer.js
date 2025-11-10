"use strict";

// =========================
// Funções de navegação
// =========================
function showPage(pageId) {
	document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); // Remove classe active de todas as páginas.
	const page = document.getElementById(pageId); // Obtém o elemento da página para mostrar.
	if (page) page.classList.add('active'); // Adiciona classe active à página selecionada.
}

window.showToSignup = () => showPage("signupPage"); // Atalho para mostrar página de registo.
window.showToLogin = () => showPage("loginPage"); // Atalho para mostrar página de login.
window.showToMain = () => showPage("mainPage"); // Atalho para mostrar página principal.
window.showToDashboard = () => {
	showPage("dashboardPage");	// Mostra a página da dashboard.
	window.handleRead(); // Atualiza e lê os dados do utilizador quando mostra a dashboard.
};

// =========================
// Criação de Conta (Registo)
// =========================
window.handleSignup = (event) => {
	event.preventDefault(); // Previne o comportamento padrão do form (recarregar a página).
	const name = document.getElementById("signupName").value; // Obtém o nome do input.
	const email = document.getElementById("signupEmail").value; // Obtém o email do input.
	const password = document.getElementById("signupPassword").value; // Obtém a password do input.
	const confirm = document.getElementById("signupConfirm").value; // Obtém a confirmação de password.
	if (password !== confirm) { // Verifica se passwords coincidem.
		alert("As palavras-passes não combinam."); // Alerta o utilizador caso as passwords não coincidam.
		return; // Sai da função sem enviar pedido.
	}
	const xhr = new XMLHttpRequest(); // Cria um novo XMLHttpRequest.
	xhr.open("POST", "/signup", true); // Configura o pedido POST para /signup de forma assíncrona.
	xhr.setRequestHeader("Content-Type", "application/json"); // Define o header indicando JSON no corpo.
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) { // Verifica se pedido terminou com sucesso.
			alert("Registo bem-sucedido."); // Informa o utilizador.
			window.showToLogin(); // Redireciona para a página de login.
		} else if (xhr.readyState === 4) {
			alert("Erro no registo: " + xhr.responseText); // Mostra erro retornado pelo servidor.
		}
	};
	xhr.send(JSON.stringify({ name: name, email: email, password: password })); // Envia o corpo em JSON com os dados do registo.
};

// =========================
// Início de Sessão (Login)
// =========================
window.handleLogin = (event) => {
	event.preventDefault(); // Previne reload de página no submit do form.
	const email = document.getElementById("loginEmail").value; // Lê email do input.
	const password = document.getElementById("loginPassword").value; // Lê password do input.
	const xhr = new XMLHttpRequest(); // Cria XMLHttpRequest para login.
	xhr.open("POST", "/login", true); // Abre pedido POST para /login.
	xhr.setRequestHeader("Content-Type", "application/json"); // Define cabeçalho JSON.
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) { // Se login bem-sucedido.
			alert("Login bem-sucedido."); // Informa o utilizador.
			window.showToMain(); // Mostra a página principal.
		} else if (xhr.readyState === 4 && xhr.status === 401) {
			alert("Dados inseridos incorretamente."); // Mensagem para credenciais inválidas.
		} else if (xhr.readyState === 4) {
			alert("Erro no login: " + xhr.responseText); // Mensagem para outros erros.
		}
	};
	xhr.send(JSON.stringify({ email: email, password: password })); // Envia email e password em JSON.
};

// =========================
// Término de Sessão (Logout)
// =========================
window.handleLogout = () => {
	const xhr = new XMLHttpRequest(); // Cria XMLHttpRequest para logout.
	xhr.open("POST", "/logout", true); // Abre pedido POST para /logout.
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) { // Se logout bem-sucedido.
			alert("Logout bem-sucedido."); // Informa o utilizador.
			if (document.getElementById("dashboardPage")) { // Se existir dashboard na página atual.
				window.showToLogin(); // Mostra a página de login.
			}
			if (document.getElementById("mainPage")) { // Se existir mainPage.
				window.showToLogin(); // Mostra a página de login.
			}
		} else if (xhr.readyState === 4) {
			alert("Erro no logout: " + xhr.responseText); // Mensagem em caso de erro.
		}
	};
	xhr.send(); // Envia pedido sem corpo.
};

// =========================
// Ler os dados da conta do utilizador
// =========================
window.handleRead = () => {
	const dashboardElem = document.getElementById("dashboardPage"); // Obtém elemento da dashboard.
	if (!dashboardElem) return; // Sai se a dashboard não existir na página.

	const xhr = new XMLHttpRequest(); // Cria XMLHttpRequest para obter dados do utilizador.
	xhr.withCredentials = true; // Incluir cookies de sessão no pedido.
	xhr.open("GET", "/user", true); // Abre pedido GET para /user.
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				const resp = JSON.parse(xhr.responseText); // Faz parse do JSON de resposta.
				const user = resp.user; // Extrai objecto user da resposta.
				const nameElem = document.getElementById("userName"); // Elemento para mostrar nome.
				const emailElem = document.getElementById("userEmail"); // Elemento para mostrar email.
				if (nameElem && user.user_name) nameElem.textContent = user.user_name; // Atualiza nome na UI.
				if (emailElem && user.user_email) emailElem.textContent = user.user_email; // Atualiza email na UI.
			} else {
				alert("Erro ao obter dados do utilizador: " + xhr.responseText); // Alerta em caso de erro.
			}
		}
	};
	xhr.send(); // Envia pedido.
};

// =========================
// Atualizar os dados da conta do utilizador
// =========================
window.handleUpdate = () => {
	const name = document.getElementById("updateName").value.trim(); // Lê e limpa o nome do input.
	const email = document.getElementById("updateEmail").value.trim(); // Lê e limpa o email do input.
	const newPasswordValue = document.getElementById("updatePassword").value.trim(); // Lê e limpa nova password.

	const body = {}; // Objecto para construir o corpo do pedido.
	if (name) body.name = name; // Adiciona nome se fornecido.
	if (email) body.email = email; // Adiciona email se fornecido.
	if (newPasswordValue) body.newPassword = newPasswordValue; // Adiciona nova password se fornecida.

	console.log("Objeto Body antes de enviar:", body); // Log para debugging do corpo que será enviado.

	if (Object.keys(body).length === 0) { // Verifica se há algum campo para atualizar.
		alert("Preencha pelo menos um campo (Nome, Email ou Password) para atualizar."); // Alerta se nenhum campo foi preenchido.
		return; // Sai sem enviar pedido.
	}

	const xhr = new XMLHttpRequest(); // Cria XMLHttpRequest para update.
	xhr.withCredentials = true; // Inclui cookies de sessão no pedido.
	xhr.open("PUT", "/user", true); // Abre pedido PUT para /user.
	xhr.setRequestHeader("Content-Type", "application/json"); // Define cabeçalho JSON.

	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			let resp = { Message: "Resposta desconhecida do servidor." }; // Padrão caso não seja JSON.
			try {
				resp = JSON.parse(xhr.responseText); // Tenta parsear a resposta.
			} catch (e) {
				// ignora parse errors e usa a mensagem padrão.
			}

			if (xhr.status === 200) {
				alert(resp.Message || "Dados atualizados com sucesso."); // Alerta de sucesso com mensagem do servidor.
				toggleUpdateForm(false); // Fecha o formulário de atualização.
				window.handleRead(); // Recarrega os dados do utilizador.
			} else {
				alert("Erro ao atualizar dados: " + (resp.Message || `Erro de rede/servidor (${xhr.status}).`)); // Mostra erro detalhado.
			}
		}
	};
	xhr.send(JSON.stringify(body)); // Envia corpo em JSON com os campos a atualizar.
};

document.addEventListener('DOMContentLoaded', window.handleRead); // Lança handleRead quando o DOM está carregado.

// =========================
// Mostrar e esconder o formulário de atualização dos dados da conta do utilizador
// =========================
window.toggleUpdateForm = (show) => {
	const form = document.getElementById("updateForm"); // Obtém o formulário de update.
	if (form) {
		form.style.display = show ? 'block' : 'none'; // Ajusta display conforme parametro.
		if (!show) {
			document.getElementById("updateName").value = ''; // Limpa campo nome quando esconde.
			document.getElementById("updateEmail").value = ''; // Limpa campo email quando esconde.
			document.getElementById("updatePassword").value = ''; // Limpa campo password quando esconde.
		}
	}
}

// =========================
// Eliminação da conta do utilizador
// =========================
window.handleDelete = () => {
	const confirmDelete = confirm("Tem a certeza de que deseja eliminar a conta?"); // Pergunta de confirmação padrão do browser.
	if (!confirmDelete) return; // Sai se não confirmado.
	const email = prompt("Introduza o seu email:") // Solicita email via prompt para confirmar identidade.
	const password = prompt("Introduza a sua password para confirmar a eliminação da conta:"); // Solicita password via prompt.
	if (!email || !password) {
		alert("Email e password obrigatórias para eliminar a conta."); // Alerta se faltar dados.
		return; // Sai sem enviar pedido.
	}
	const xhr = new XMLHttpRequest(); // Cria XMLHttpRequest para delete.
	xhr.open("DELETE", "/delete", true); // Abre pedido DELETE para /delete.
	xhr.setRequestHeader("Content-Type", "application/json"); // Define cabeçalho JSON.
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				alert("Conta eliminada com sucesso."); // Alerta de sucesso.
				window.showToLogin(); // Redireciona para login.
			} else {
				alert("Erro a apagar a conta: " + xhr.responseText); // Mensagem de erro vinda do servidor.
			}
		}
	};
	xhr.send(JSON.stringify({ confirmDelete: true, email: email, password: password })); // Envia confirmação, email e password em JSON.
};

// =========================
// Verificar sessões existentes
// =========================
window.loginStatus = () => {
	const xhr = new XMLHttpRequest(); // Cria XMLHttpRequest para check-session.
	xhr.open("GET", "/check-session", true); // Abre pedido GET para /check-session.
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			try {
				const resp = JSON.parse(xhr.responseText); // Tenta parsear resposta.
				if (xhr.status === 200 && resp.sessionActive) { // Verifica campo sessionActive na resposta.
					alert("Bem-vindo de volta.")
					window.showToMain(); // Se sessão ativa, mostra main.
				} else if (xhr.status === 401) {
					window.showToLogin(); // Se não autorizado, mostra login.
				} else {
					console.error("Erro ao verificar sessão: " + xhr.responseText); // Log de erro para debugging.
					window.showToLogin(); // Mostra login por segurança.
				}
			} catch (e) {
				console.error("Erro ao parsear resposta:", e); // Log de erro de parse.
				window.showToLogin(); // Mostra login se não conseguiu parsear a resposta.
			}
		}
	};
	xhr.send(); // Envia pedido.
};

// =========================
// Dados estáticos dos animais (JSON, para ser transferidos para a BD)
// =========================
const SPECIES_DATA = {
	'Mamíferos': [
		{
			name: 'Leão', // Nome da espécie.
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/400px-Lion_waiting_in_Namibia.jpg', // URL da imagem.
			population: '~20.000', // Indicação de população.
			status: 'Vulnerável', // Estado de conservação.
			statusClass: 'status-endangered', // Classe CSS para estado.
			description: 'O leão é um grande felino do género Panthera, nativo de África e da Índia. Conhecido como "rei da selva", vive em grupos familiares chamados alcateias.' // Descrição.
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
let currentSpecies = ''; // Guarda a espécie atual seleccionada.

function showSpeciesDetail(species) {
	currentSpecies = species; // Define a espécie actual.

	const headerTitle = document.getElementById('speciesHeaderTitle'); // Elemento do cabeçalho da secção.
	const contentTitle = document.getElementById('speciesContentTitle'); // Elemento do título do conteúdo.
	const grid = document.getElementById('animalGrid'); // Elemento onde serão inseridos os cards.

	headerTitle.textContent = species; // Atualiza título do cabeçalho.
	contentTitle.textContent = species; // Atualiza título do conteúdo.
	grid.innerHTML = ''; // Limpa o grid antes de povoar.

	const animals = SPECIES_DATA[species] || []; // Obtém array de animais para a espécie ou array vazio.

	animals.forEach(animal => {
		const card = document.createElement('div'); // Cria um elemento div para card.
		card.className = 'animal-card'; // Atribui classe CSS ao card.
		card.onclick = () => showAnimalProfile(animal); // Define onclick para mostrar perfil do animal.
		card.innerHTML = `
				<div class="animal-image" style="background-image: url('${animal.img}');"></div>
				<div class="animal-name">${animal.name}</div>
			`;
		grid.appendChild(card); // Adiciona o card ao grid.
	});

	showPage('speciesDetailPage'); // Mostra a página de detalhe da espécie.
}

// =========================
// Perfil do animal
// =========================
function showAnimalProfile(animal) {
	if (!animal) return; // Retorna se não foi passado objecto animal.

	document.getElementById('animalProfileTitle').textContent = animal.name; // Define título do perfil com o nome do animal.
	document.getElementById('animalProfileImage').src = animal.img; // Define src da imagem do perfil.
	document.getElementById('animalPopulation').textContent = animal.population || 'Unknown'; // Mostra população ou 'Unknown' se ausente.

	const statusEl = document.getElementById('animalStatus'); // Elemento que mostra o estado de conservação.
	statusEl.textContent = animal.status || 'Unknown'; // Define texto do estado.
	statusEl.className = `animal-value ${animal.statusClass || ''}`; // Define classes CSS para estilo do estado.

	document.getElementById('animalDescription').textContent = animal.description || 'No description available.'; // Define descrição do animal.

	showPage('animalProfilePage'); // Mostra a página de perfil do animal.
}