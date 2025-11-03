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

    // Rever tudo abaixo








    // Navigation
function showSignup() { 
    togglePage('signupPage');
}

function showLogin() { 
    togglePage('loginPage');
}

function showDashboard() {
    togglePage('dashboardPage');
}

function showActivity() {
    togglePage('activityPage');
}

function goToMain() { 
    togglePage('mainPage'); 
    document.body.classList.add('main-page'); 
}

function togglePage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Validation
function validateEmail(email) { 
    return email.endsWith('@gmail.com'); 
}

// Signup
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

// Back button logic
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('backRectDashboard').addEventListener('click', goToMain);
    document.getElementById('backTextDashboard').addEventListener('click', goToMain);
    document.getElementById('backRectActivity').addEventListener('click', goToMain);
    document.getElementById('backTextActivity').addEventListener('click', goToMain);
});
};