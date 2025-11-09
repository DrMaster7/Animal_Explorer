"use strict";

// Funções de navegação para aceder de uma página para outra.
window.showLoginToSignup = () => {
    document.getElementById("loginPage").classList.remove("active");
    document.getElementById("signupPage").classList.add("active");
};

window.showSignupToLogin = () => {
    document.getElementById("signupPage").classList.remove("active");
    document.getElementById("loginPage").classList.add("active");
};

window.showLoginToMain = () => {
    document.getElementById("loginPage").classList.remove("active");
    document.getElementById("mainPage").classList.add("active");
}

window.showMainToLogin = () => {
    document.getElementById("mainPage").classList.remove("active");
    document.getElementById("loginPage").classList.add("active");
};

window.showMainToDashboard = () => {
    document.getElementById("mainPage").classList.remove("active");
    document.getElementById("dashboardPage").classList.add("active");
}

window.showDashboardToMain = () => {
    document.getElementById("dashboardPage").classList.remove("active");
    document.getElementById("mainPage").classList.add("active");
}

// Registo
window.handleSignup = (event) => {
    event.preventDefault();
    var name = document.getElementById("signupName").value;
    var email = document.getElementById("signupEmail").value;
    var password = document.getElementById("signupPassword").value;
    var confirm = document.getElementById("signupConfirm").value;
    if (password !== confirm) {
        alert("As palavras-passes não combinam.");
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/signup", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Registo bem-sucedido.");
            window.showSignUpToLogin();
        } else if (xhr.readyState === 4) {
            alert("Erro no registo: " + xhr.responseText);
        }
    };
    xhr.send(JSON.stringify({ name: name, email: email, password: password }));
}

// Login
window.handleLogin = (event) => {
    event.preventDefault();
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Login bem-sucedido.");
            window.showLoginToMain();
        } else if (xhr.readyState === 4 && xhr.status === 401) {
            alert("Dados inseridos incorretamente.");
        } else if (xhr.readyState === 4) {
            alert("Erro no login: " + xhr.responseText);
        }
    };
    xhr.send(JSON.stringify({ email: email, password: password }));
}

// Logout
window.handleLogout = () => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/logout", true); 
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Logout bem-sucedido.");
            window.showMainToLogin();
        } else if (xhr.readyState === 4) {
            alert("Erro no logout: " + xhr.responseText);
        }
    };
    xhr.send(); 
};

// Verificar sessão existente
window.loginStatus = () => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/check-session", true); 
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) { // Se existir uma sessão ativa
                const response = JSON.parse(xhr.responseText);
                console.log(`Bem-vindo de volta, ${response.user.user_name}`);
                alert("Bem-vindo de volta.")
                window.showLoginToMain(); 
            } else if (xhr.status === 401) { // Se não existir uma sessão ativa
                console.log("Sem sessão, a mostrar ecrã de login.");
                window.showMainToLogin();
            } else { // Caso exista alguma falha
                console.error("Erro ao verificar sessão: " + xhr.responseText);
                window.showMainToLogin(); // Redireciona diretamente para o login.
            }
        }
    };
    xhr.send();
};


/**
 * Será executada quando a página for carregada, criando a variável "info" e um objeto Information.
 * Irá também pedir ao servidor o carregamento dos dados de forma síncrona (AJAX).
 * @memberof window
 * @params {Event} event - objeto que representará o evento
 */

/*
window.onload = (event) => {
    var info = new Information("divInformation");
    info.getUser();
    info.getAnimal();
    info.getLogs();
    window.info = info;
    window.loginStatus();
};
*/

/** 
* @class Guarda toda informação necessaria na execução do exercicio 
* @constructs Informacao
* @param {string} id - id do elemento HTML que contém a informação.
* 
* @property {string} id - id do elemento HTML que contém a informação.
* @property {sensor[]} sensors - Array de objetos do tipo Sensor, para guardar todos os users do nosso sistema
*/

/*
class Information {
    constructor(id) {
        this.id = id;
        this.user=[];
    }
}
*/