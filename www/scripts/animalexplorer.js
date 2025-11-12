"use strict";

// =========================
// Funções de navegação
// =========================
function showPage(pageId) {
	document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); // Remove classe 'active' de todas as páginas.
	const page = document.getElementById(pageId); // Página para mostrar.
	if (page) page.classList.add('active'); // Ativa a página selecionada.
}

window.showToSignup = () => showPage("signupPage"); // Vai para o registo.
window.showToLogin = () => showPage("loginPage"); // Vai para o login.
window.showToMain = () => showPage("mainPage"); // Vai para a página principal.
window.showToDashboard = () => { // Vai para a dashboard.
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
	const xhr = new XMLHttpRequest(); // Cria um XMLHttpRequest.
	xhr.open("POST", "/signup", true); // Configura o pedido POST para /signup.
	xhr.setRequestHeader("Content-Type", "application/json"); // Define o header indicando JSON no corpo.
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) { // Se o pedido foi bem-sucedido.
				alert("Registo bem-sucedido."); // Informa o utilizador.
				window.showToLogin(); // Redireciona para a página de login.
				document.getElementById("signupName").value = ''; // Limpa campo nome quando sai da página.
				document.getElementById("signupEmail").value = ''; // Limpa campo email quando sai da página.
				document.getElementById("signupPassword").value = ''; // Limpa campo da password quando sai da página.
				document.getElementById("signupConfirm").value = ''; // Limpa campo da confirmação da password quando sai da página.
			} else { // Se não terminou com sucesso.
				alert("Erro no registo: " + xhr.responseText); // Mostra erro retornado pelo servidor.
			}
		}
	};
	xhr.send(JSON.stringify({ name: name, email: email, password: password })); // Envia pedido em JSON que inclui os dados do registo.
};

// =========================
// Início de Sessão (Login)
// =========================
window.handleLogin = (event) => {
	event.preventDefault(); 
	const email = document.getElementById("loginEmail").value; // Obtém o email do input.
	const password = document.getElementById("loginPassword").value; // Obtém a password do input.
	const xhr = new XMLHttpRequest(); // Cria um XMLHttpRequest para login.
	xhr.open("POST", "/login", true); // Configura o pedido POST para /login.
	xhr.setRequestHeader("Content-Type", "application/json"); // Define o header indicando JSON no corpo.
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) { // Se o pedido foi bem-sucedido.
				alert("Login bem-sucedido."); // Informa o utilizador.
				window.showToMain(); // Redireciona para a página principal.
				document.getElementById("loginEmail").value = ''; // Limpa campo email quando sai da página.
                document.getElementById("loginPassword").value = ''; // Limpa campo da password quando sai da página.
			} else if (xhr.status === 401) { // Se o pedido terminou num erro 401 (devido a credenciais incorretas).
				alert("Dados inseridos incorretamente."); // Informa o utilizador para credenciais inválidas.
			} else { // Se não terminou com sucesso.
				alert("Erro no login: " + xhr.responseText); // Mostra erro retornado pelo servidor.
			}
		}
	};
	xhr.send(JSON.stringify({ email: email, password: password })); // Envia pedido em JSON que inclui os dados do login.
};

// =========================
// Término de Sessão (Logout)
// =========================
window.handleLogout = () => {
	const xhr = new XMLHttpRequest(); // Cria XMLHttpRequest para logout.
	xhr.open("POST", "/logout", true); // Configura o pedido POST para /logout.
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) { // Se o pedido for bem-sucedido.
				alert("Logout bem-sucedido."); // Informa o utilizador.
				window.showToLogin(); // Redireciona para a página de login.
			} else { // Caso não terminou com sucesso.
				alert("Erro no logout: " + xhr.responseText); // Mostra erro retornado pelo servidor.
			}
		}
	};
	xhr.send(); // Envia pedido em JSON.
};

// =========================
// Ler os dados da conta do utilizador
// =========================
window.handleRead = () => {
	const dashboardElem = document.getElementById("dashboardPage"); // Obtém elemento da dashboard.
	if (!dashboardElem) return; // Sai se a dashboard não existir na página.

	const xhr = new XMLHttpRequest(); // Cria XMLHttpRequest para obter dados do utilizador.
	xhr.withCredentials = true; // Incluir o cookie de sessão no pedido.
	xhr.open("GET", "/user", true); // Abre pedido GET para /user.
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) { // Se o pedido for bem-sucedido.
				const resp = JSON.parse(xhr.responseText); // Faz parse do JSON de resposta.
				const user = resp.user; // Extrai objecto user da resposta.
				const nameElem = document.getElementById("userName"); // Obtém elemento para mostrar nome.
				const emailElem = document.getElementById("userEmail"); // Obtém elemento para mostrar email.
				if (nameElem && user.user_name) nameElem.textContent = user.user_name; // Atualiza nome na UI.
				if (emailElem && user.user_email) emailElem.textContent = user.user_email; // Atualiza email na UI.
			} else { // Caso não terminou com sucesso.
				alert("Erro ao obter dados do utilizador: " + xhr.responseText); // Mostra erro retornado pelo servidor.
			}
		}
	};
	xhr.send(); // Envia pedido em JSON.
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

	if (Object.keys(body).length === 0) { // Verifica se há algum campo para atualizar.
		alert("Preencha pelo menos um campo para atualizar."); // Retorna alerta se nenhum campo foi preenchido.
		return; // Sai sem enviar pedido.
	}

	const xhr = new XMLHttpRequest(); // Cria XMLHttpRequest para atualizar os dados do utilizador.
	xhr.withCredentials = true; // Inclui o cookie de sessão no pedido.
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

			if (xhr.status === 200) { // Se o pedido for bem-sucedido.
				alert(resp.Message || "Dados atualizados com sucesso."); // Informa o utilizador.
				toggleUpdateForm(false); // Fecha o formulário de atualização.
				window.handleRead(); // Recarrega os dados do utilizador.
			} else { // Caso não terminou com sucesso.
				alert("Erro ao atualizar dados: " + (resp.Message || `Erro de rede/servidor (${xhr.status}).`)); // Mostra erro retornado.
			}
		}
	};
	xhr.send(JSON.stringify(body)); // Envia pedido em JSON que inclui os campos a atualizar.
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
	if (!confirmDelete) return; // Sai se não for confirmado.
	const email = prompt("Introduza o seu email para confirmar a eliminação da conta:") // Solicita email via prompt para confirmar identidade.
	if (!email) { // Caso um dos campos não tenha sido preenchido.
		alert("Email obrigatório para eliminar a conta."); // Alerta o utilizador se faltar o email.
		return; // Sai sem enviar pedido.
	}
	const password = prompt("Introduza a sua password para confirmar a eliminação da conta:"); // Solicita password via prompt para confirmar identidade.
	if (!password) { // Caso um dos campos não tenha sido preenchido.
		alert("Password obrigatória para eliminar a conta."); // Alerta o utilizador se faltar a password.
		return; // Sai sem enviar pedido.
	}
	const xhr = new XMLHttpRequest(); // Cria XMLHttpRequest para eliminar os dados do utilizador.
	xhr.open("DELETE", "/delete", true); // Abre pedido DELETE para /delete.
	xhr.setRequestHeader("Content-Type", "application/json"); // Define cabeçalho JSON.
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) { // Se o pedido for bem-sucedido.
				alert("Conta eliminada com sucesso."); // Alerta de sucesso.
				window.showToLogin(); // Redireciona para login.
			} else { // Caso não terminou com sucesso.
				alert("Erro a apagar a conta: " + xhr.responseText); // Mostra erro retornado pelo servidor.
			}
		}
	};
	xhr.send(JSON.stringify({ confirmDelete: true, email: email, password: password })); // Envia pedido em JSON que inclui os campos necessário para a remoção da conta.
};

// =========================
// Verificar sessões existentes
// =========================
window.loginStatus = () => {
	const xhr = new XMLHttpRequest(); // Cria XMLHttpRequest para verificar a sessão.
	xhr.open("GET", "/check-session", true); // Abre pedido GET para /check-session.
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			try {
				const resp = JSON.parse(xhr.responseText); // Tenta parsear resposta.
				if (xhr.status === 200 && resp.sessionActive) { // Se o pedido for bem sucedido e a sessão estiver ativa.
					alert("Bem-vindo de volta.")
					window.showToMain(); // Redireciona para o main.
				} else if (xhr.status === 401) { // Se o pedido terminou num erro 401 (a sessão não estiver ativa).
					alert("A sessão expirou ou ficou inválida. Volte a fazer login.")
					window.showToLogin(); // Redireciona para o login.
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
	xhr.send(); // Envia pedido em JSON.
};

// =========================
// Detalhes da espécie
// =========================
let currentSpecies = null;
function showSpeciesDetail(species) {
	currentSpecies = species; // Define a espécie actual.

	const headerTitle = document.getElementById('speciesHeaderTitle'); // Elemento do cabeçalho da secção.
	const contentTitle = document.getElementById('speciesContentTitle'); // Elemento do título do conteúdo.
	const grid = document.getElementById('animalGrid'); // Elemento onde serão inseridos os cards.

	headerTitle.textContent = species; // Atualiza título do cabeçalho.
	contentTitle.textContent = species; // Atualiza título do conteúdo.
	grid.innerHTML = '';

	const xhr = new XMLHttpRequest(); // Cria XMLHttpRequest para verificar a sessão.
	const url = `/animal?category=${encodeURIComponent(species)}`;

	xhr.open("GET", url, true); // Abre pedido GET para /animal a partir da categoria escolhida, retornando as espécies dessa categoria.
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) { // Se o pedido foi bem-sucedido.
                try {
                    const resp = JSON.parse(xhr.responseText); // Tenta parsear resposta.
                    const animals = resp.animal || []; // O array de animais está no campo 'animal'

                    // Criação dos cartões dos animais
                    animals.forEach(animal => {
                        const card = document.createElement('div');
                        card.className = 'animal-card';
                        card.onclick = () => showAnimalProfile(animal);  // Os nomes dos campos usam as desiganção da base de dados
                        card.innerHTML = `
                            <div class="animal-image" style="background-image: url('${animal.animal_image_url}');"></div>
                            <div class="animal-name">${animal.animal_name}</div>
                        `;
                        grid.appendChild(card);
                    });

                    if (animals.length === 0) { // Se não houver nenhum animal para uma certa espécie.
                        grid.innerHTML = 'Nenhum animal encontrado desta espécie.';
                    }
                } catch (e) { // Caso ocorra algum erro.
                    grid.innerHTML = 'Erro ao processar a resposta do servidor.';
                    console.error("Erro ao parsear JSON:", e);
                }
            } else { // Caso não terminou com sucesso.
                grid.innerHTML = `Erro ao carregar dados: ${xhr.status} ${xhr.statusText}`;
                alert(`Erro ao carregar animais: ${xhr.responseText}`);
            }
        }
    };
	xhr.send(); 
    showPage('speciesDetailPage'); // Mostra a página com os detalhes da espécie selecionada.
}

// =========================
// Perfil do animal
// =========================
function showAnimalProfile(animal) {
    if (!animal) return; // Retorna se não foi passado objecto animal.

	document.getElementById('animalProfileTitle').textContent = animal.animal_name; // Define título do perfil com o nome do animal.
	document.getElementById('animalProfileImage').src = animal.animal_image_url; // Define src da imagem do perfil.
	document.getElementById('animalPopulation').textContent = animal.animal_population; // Mostra a população do animal.
	document.getElementById('animalHabitat').textContent = animal.animal_habitat; // Mostra o habitat do animal.

	const statusEl = document.getElementById('animalStatus'); // Elemento que mostra o estado de conservação.
	statusEl.textContent = animal.animal_status; // Define o texto do estado do animal (NOTA: mesmo os animais sem status tem a sua consideração local).
	statusEl.className = `animal-value ${animal.animal_status_class || ''}`; // Define as classes CSS para o estilo do estado.

	document.getElementById('animalDescription').textContent = animal.animal_description || 'No description available.'; // Define descrição do animal.

    showPage('animalProfilePage'); // Mostra a página de perfil do animal.
}