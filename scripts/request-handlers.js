"use strict";
const mysql = require("mysql2");
const options = require("./connectionOptions.json");
const bcrypt = require("bcrypt");

/**
 * Função específica para executar queries que irão atuar e interagir com as colunas da base de dados (dependendo do pedido), 
 * evitando assim duplicação de código.
 * @param {*} res
 * @param {*} sql
 * @param {*} label
 */
function runQuery(res, sql, label) {
    var connection = mysql.createConnection(options);
    connection.connect();
    connection.query(sql, function (err, rows, fields) {
        if (err) {
            res.status(404).json({ "Message": `Error - MySQL query to ${label}` });
        } else {
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
    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, 10);
    
    if (req.method === "PUT") { // Se o método REST for PUT (Update) - Atualizar dados da Conta
        runQuery(res, mysql.format("UPDATE user SET user_name = ?, user_email = ?, user_password = ? WHERE id = ?", [name, email, hash, id]), "user");
    } else if (req.method === "DELETE") { // Se o método REST for DELETE (Delete) - Eliminar Conta
        runQuery(res, mysql.format("DELETE FROM user WHERE user_id = ?", [id]), "user");
        runQuery(res, mysql.format("DELETE FROM logs WHERE log_user_id = ?", [id]), "logs");
    } else { // Caso não seja encontrado nenhum método REST
        res.status(404).json({ "Message": `Error - MySQL method not found` });
    }
}
module.exports.crudUsers = crudUsers;

/**
 * Função que permite lidar com os novos utilizadores que se registam no registo, recorrendo ao POST.
 * 
 * @param {Object} req
 * @param {Object} res
 */
const handleSignup = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, 10);
    
    var connection = mysql.createConnection(options);
    connection.connect();
    connection.query(mysql.format("INSERT INTO user (user_name, user_email, user_password) VALUES (?, ?, ?)", [name, email, hash]), function (err, rows, fields) {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') { // Código de erro 1062 é tipicamente para entrada duplicada (ex: email repetido)
                res.status(409).json({ "Message": "Erro - Outra conta já utiliza esse email." });
            } else {
                res.status(500).json({ "Message": `Erro - MySQL query to signup: ${err.message}` });
            }
        } else {
            res.status(200).json({ "Message": "Sucesso - Conta registada no Animal Explorer. Bem-vindo.", "user_id": rows.insertId });
        }
    });
    connection.end();
}
module.exports.handleSignup = handleSignup;

/**
 * Função que permite lidar com os logins dos utilizadores recorrendo ao POST.
 * 
 * @param {Object} req
 * @param {Object} res
 */
const handleLogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    var connection = mysql.createConnection(options);
    connection.connect();
    connection.query(mysql.format("SELECT user_id, user_name, user_email, user_password FROM user WHERE user_email = ?", [email]), function (err, rows) {
        if (err) {
            res.status(500).json({ "Message": `Error - MySQL query to login: ${err.message}` });
            connection.end();
        } else if (rows.length === 0) { // Utilizador não encontrado
            res.status(401).json({ "Message": "Erro - Dados inseridos incorretamente." });
            connection.end();
        } else {
            const user = rows[0];
            bcrypt.compare(password, user.user_password, function(err, result) { // Comparar a password fornecida com a hash armazenada
                if (result === true) { // Login bem-sucedido, removendo a password antes de enviar o objeto de volta.
                    req.session.user = {
                        user_id: user.user_id,
                        user_name: user.user_name,
                        user_email: user.user_email
                    };
                    delete user.user_password;
                    res.status(200).json({ "Message": "Sucesso - Login bem-sucedido. Bem-vindo.", "user": req.session.user });
                } else { // Password incorreta
                    res.status(401).json({ "Message": "Dados inseridos incorretamente." });
                }
                connection.end();
            });
        }
    });
}
module.exports.handleLogin = handleLogin;

/**
 * Função que permite lidar com os logouts dos utilizadores.
 * 
 * @param {Object} req
 * @param {Object} res
 */
const handleLogout = (req, res) => {
    req.session.destroy(err => { // Destrói a sessão no servidor e limpa o cookie.
        if (err) {
            return res.status(500).json({ "Message": "Erro ao fazer logout." });
        }
        res.clearCookie('connect.sid'); // 'connect.sid' = Nome padrão do cookie de sessão do Express
        res.status(200).json({ "Message": "Sucesso - Logout bem-sucedido." });
    });
}
module.exports.handleLogout = handleLogout;

/**
 * Função que permite verificar se existe alguma sessão iniciado recorrendo aos cookies, evitando assim que o utilizador que
 * tenha feito login anteriormente tenha de fazer outra vez enquanto o cookie estiver ativado.
 * 
 * @param {Object} req
 * @param {Object} res
 */
const handleCheckSession = (req, res) => {
    if (req.session.user) {
        res.status(200).json({ 
            "Message": "Sessão ativa", "user": req.session.user 
        });
    } else {
        // Sessão inativa ou cookie expirado/ausente
        res.status(401).json({ 
            "Message": "Sessão inativa. É necessário login." 
        });
    }
}
module.exports.handleCheckSession = handleCheckSession;

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