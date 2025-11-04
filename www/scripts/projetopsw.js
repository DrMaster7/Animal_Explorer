"use strict";
/**
 * Será executada quando a página for carregada, criando a variável "info" e um objeto Information.
 * Irá também pedir ao servidor o carregamento dos dados de forma assíncrona (AJAX).
 * @memberof window
 * @params {Event} event - objeto que representará o evento
 */
window.onload = (event) => {
    var info = new Information("divInformation");
    info.getUser();
    info.getAnimal();
    info.getLogs();
    window.info = info;

// Mostrar Registo
    showSignup = () => {
        document.getElementById("headerTitle").textContent="Registo";
        //clearChart(); - Se usar gráficos.
        replaceChilds(this.id,document.createElement("div"));
        togglePage('signupPage');
    };

// Mostrar Login
    showLogin = () => {
        document.getElementById("headerTitle").textContent="Login";
        //clearChart(); - Se usar gráficos.
        replaceChilds(this.id,document.createElement("div"));
        togglePage('loginPage');
    };

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
};