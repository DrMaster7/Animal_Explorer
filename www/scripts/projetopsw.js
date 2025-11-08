"use strict";

/**
 * Funções de navegação para aceder ao registo e ao login, respetivamente.
 */
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

// Handle Sign Up
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

// Handle Login
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
            alert("Erro no registo: " + xhr.responseText);
        }
    };
    xhr.send(JSON.stringify({ email: email, password: password }));
}

/**
 * Será executada quando a página for carregada, criando a variável "info" e um objeto Information.
 * Irá também pedir ao servidor o carregamento dos dados de forma síncrona (AJAX).
 * @memberof window
 * @params {Event} event - objeto que representará o evento
 */
window.onload = (event) => {
    var info = new Information("divInformation");
    info.getUser();
    info.getAnimal();
    info.getLogs();
    window.info = info;
/*

// Mostrar Dashboard
    showDashboard = () => {
        document.getElementById("headerTitle").textContent="Dashboard";
        //clearChart(); - Se usar gráficos.
        replaceChilds(this.id,document.createElement("div"));
        togglePage('dashboardPage');
    };

// Mostrar Atividade
    showActivity = () => {
        document.getElementById("headerTitle").textContent="Atividade";
        //clearChart(); - Se usar gráficos.
        replaceChilds(this.id,document.createElement("div"));
        togglePage('activityPage');
    };

// Voltar ao Main
function goToMain() { 
    togglePage('mainPage'); 
    document.body.classList.add('main-page'); 
}

// Mostrar Registo
function togglePage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Validação
function validateEmail(email) { 
    return email.endsWith('@gmail.com'); 
}

// Registo
function handleSignup(e) {
    e.preventDefault();
    const email = signupEmail.value.trim();
    const password = signupPassword.value.trim();
    const confirm = signupConfirm.value.trim();
    if (!validateEmail(email)) return alert('Email must be @gmail.com');
    if (password !== confirm) return alert('Passwords do not match');
    if (localStorage.getItem('user_' + email)) return alert('User exists!');
    localStorage.setItem('user_' + email, JSON.stringify({ email, password }));
    alert('Signup successful!');
    showLogin();
}

// Login
function handleLogin(e) {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    const stored = JSON.parse(localStorage.getItem('user_' + email));
    if (!stored || stored.password !== password) return alert('Invalid login!');
    goToMain();
}

// Botão Login
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('backRectDashboard').addEventListener('click', goToMain);
    document.getElementById('backTextDashboard').addEventListener('click', goToMain);
    document.getElementById('backRectActivity').addEventListener('click', goToMain);
    document.getElementById('backTextActivity').addEventListener('click', goToMain);
});

*/

};