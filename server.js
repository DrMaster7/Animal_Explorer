"use strict";

// Importação das bibliotecas necessárias
const express = require("express");                     // Framework web para criação do servidor e das rotas
const session = require("express-session");
const path = require("path");
const handlers = require("./scripts/request-handlers"); 
const app = express();                                  // Inicialização da aplicação Express

// Configurações essenciais
app.use(express.static(path.join(__dirname, 'www'))); // Serve ficheiros HTML/JS/CSS da pasta 'www'
app.use(express.json()); // Permite que o servidor entenda corpos de pedidos no formato JSON

app.use(session({
    secret: "animal",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Rotas que ligam o Frontend ao Backend
app.post("/signup", handlers.handleSignup);
app.post("/login", handlers.handleLogin);
app.post("/logout", handlers.handleLogout);
app.get("/user", handlers.handleRead);
app.put("/user", handlers.handleUpdate);
app.delete("/delete", handlers.handleDelete);
app.get("/check-session", handlers.handleCheckSession);
app.get("/animal", handlers.getAnimals);

// Inicialização do Servidor
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Servidor ativo em http://localhost:${PORT}`);
});