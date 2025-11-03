"use strict";
const mysql = require("mysql2");
const options = require("./connectionOptions.json");

/**
 * Função específica para executar queries que irão atuar e interagir com as colunas da base de dados (dependendo do pedido), 
 * evitando assim duplicação de código.
 * @param {*} res
 * @param {*} query
 * @param {*} label
 */
function runQuery(res, query, label) {
    var connection = mysql.createConnection(options);
    connection.connect();
    connection.query(sql, function (err, rows, fields) {
        if (err) {
            res.status(404).json({ "Message": `Error - MySQL query to ${label}` });
        } else {
            res.send(rows);
            res.status(200).json({ "Message": "Success", [label]: rows });
        }
    });
    connection.end();
}

/**
 * Função que permite executar as funções CRUD para a tabela user (com exceção do GET, que ficará numa função separada)
 * dependendo do pedido e recorrendo à função runQuery).
 * 
 * @param {Object} req
 * @param {Object} res
 */
const crudUsers = (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    if (req.method === "POST") { // Se o método REST for POST (Create)
        runQuery(res, mysql.format("INSERT INTO user (name, email, password) VALUES (?, ?, ?)", [name, email, password]));
    } else if (req.method === "GET") { // Se o método REST for GET (Read)
        runQuery(res, "SELECT user_id, user_name, user_email, user_password FROM user", "user");
    } else if (req.method === "PUT") { // Se o método REST for PUT (Update)
        runQuery(res, mysql.format("UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?", [name, email, password, req.params.id]));
    } else if (req.method === "DELETE") { // Se o método REST for DELETE (Delete)
        runQuery(res, mysql.format("DELETE FROM user WHERE id = ?", [req.params.id]));
        runQuery(res, mysql.format("DELETE FROM logs WHERE log_user_id = ?", [req.params.id]));
    } else { // Caso não seja encontrado nenhum método REST
        res.status(404).json({ "Message": `Error - MySQL method not found` });
    }
}
module.exports.crudUsers = crudUsers;

/**
 * Função para retornar a lista de animais da tabela animal (recorrendo à função runQuery).
 * @param {*} req
 * @param {*} res
 */
const getAnimals = (req, res) => {
    runQuery(res, "SELECT animal_id, animal_name, animal_population, animal_habitat, animal_category FROM animal", "animal");
}
module.exports.getAnimals = getAnimals;

/**
 * Função para retornar a lista dos logs da tabela logs (recorrendo à função runQuery).
 * @param {*} req
 * @param {*} res
 */
const getLogs = (req, res) => {
    runQuery(res, "SELECT log_id, log_datetime, log_user_id FROM logs", "logs");
}
module.exports.getLogs = getLogs;