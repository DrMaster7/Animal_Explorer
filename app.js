"use strict";
const express = require("express");
const requestHandlers = require("./scripts/request-handlers.js");
const app = express();

app.use(express.static("www"));
app.use(express.json());
app.use(express.urlencoded());

// Animal
app.get("/animal", requestHandlers.getAnimals);

// Logs
app.get("/logs", requestHandlers.getLogs);

// User
app.all("/user", requestHandlers.crudUsers);

app.listen(8081, function () {
    console.log("Server running at http://localhost:8081");
});