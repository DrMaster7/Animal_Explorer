"use strict";
const express = require("express");
const app = express();
const requestHandlers = require("./scripts/request-handlers.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("www"));

// Animal
app.get("/animal", requestHandlers.getAnimals);

// Logs
app.get("/logs", requestHandlers.getLogs);

// User
app.post("/signup", requestHandlers.handleSignup); // Registo
app.post("/login", requestHandlers.handleLogin); // Login
app.all("/user", requestHandlers.crudUsers);

app.listen(8081, function () {
    console.log("Server running at http://localhost:8081");
});