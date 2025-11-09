"use strict";
const mysql = require("mysql2");
const options = require("./connectionOptions.json");
const bcrypt = require("bcrypt");

/**
 * Função que executa uma query MySQL e envia resposta JSON uniforme 
 * @param {*} res
 * @param {string} sql
 * @param {string} label
 */
function runQuery(res, sql, label) {
	const connection = mysql.createConnection(options);
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
 * Função que lida com novos registos de utilizadores via POST
 * @param {*} req
 * @param {*} res
 */
const handleSignup = (req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const hash = bcrypt.hashSync(password, 10);

	const connection = mysql.createConnection(options);
	connection.connect();
	connection.query(
		mysql.format("INSERT INTO user (user_name, user_email, user_password) VALUES (?, ?, ?)", [name, email, hash]),
		function (err, rows, fields) {
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					res.status(409).json({ "Message": "Erro - Outra conta já utiliza esse email." });
				} else {
					res.status(500).json({ "Message": `Erro - MySQL query to signup: ${err.message}` });
				}
			} else {
				res.status(200).json({ "Message": "Sucesso - Conta registada no Animal Explorer. Bem-vindo.", "user_id": rows.insertId });
			}
		}
	);
	connection.end();
};
module.exports.handleSignup = handleSignup;

/**
 * Função que lida com os inícios de sessão (login) dos utilizadores via POST.
 * @param {*} req
 * @param {*} res
 */
const handleLogin = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	const connection = mysql.createConnection(options);
	connection.connect();
	connection.query(
		mysql.format("SELECT user_id, user_name, user_email, user_password FROM user WHERE user_email = ?", [email]),
		function (err, rows) {
			if (err) {
				res.status(500).json({ "Message": `Error - MySQL query to login: ${err.message}` });
				connection.end();
				return;
			}
			if (rows.length === 0) {
				res.status(401).json({ "Message": "Erro - Dados inseridos incorretamente." });
				connection.end();
				return;
			}
			const user = rows[0];
			bcrypt.compare(password, user.user_password, function(errB, result) {
				if (result === true) {
					req.session.user = {
						user_id: user.user_id,
						user_name: user.user_name,
						user_email: user.user_email
					};
					delete user.user_password;
					res.status(200).json({ "Message": "Sucesso - Login bem-sucedido. Bem-vindo.", "user": req.session.user });
				} else {
					res.status(401).json({ "Message": "Dados inseridos incorretamente." });
				}
				connection.end();
				return;
			});
		}
	);
};
module.exports.handleLogin = handleLogin;

/**
 * Função que lida com os términos de sessão (logout) dos utilizadores.
 * @param {*} req
 * @param {*} res
 */
const handleLogout = (req, res) => {
	req.session.destroy(err => {
		if (err) {
			return res.status(500).json({ "Message": "Erro ao fazer logout." });
		}
		res.clearCookie('connect.sid');
		res.status(200).json({ "Message": "Sucesso - Logout bem-sucedido." });
	});
};
module.exports.handleLogout = handleLogout;

/**
 * Função que retorna os dados do utilizador para a dashboard.
 * @param {*} req
 * @param {*} res
 */
const handleRead = (req, res) => {
	if (!req.session || !req.session.user || !req.session.user.user_id) {
		return res.status(401).json({ Message: "Não autorizado. Sessão inexistente ou inválida." });
	}
	const uid = req.session.user.user_id;
	const connection = mysql.createConnection(options);
	connection.connect();

	connection.query(
		mysql.format("SELECT user_name, user_email FROM user WHERE user_id = ?", [uid]),
		(err, rows) => {
			connection.end();
			if (err) {
				return res.status(500).json({ "Message": `Erro ao ler dados do utilizador: ${err.message}` });
			}
			if (rows.length === 0) {
				return res.status(404).json({ "Message": "Utilizador não encontrado." });
			}
			const user = rows[0];
			console.log("Dados do utilizador:", user);
			res.status(200).json({ "Message": "Sucesso", "user": user });
		}
	);
};
module.exports.handleRead = handleRead;

/**
 * Função que atualiza os dados da conta de um utilizador via PUT.
 * @param {*} req
 * @param {*} res
 */
const handleUpdate = (req, res) => {
	if (!req.session || !req.session.user || !req.session.user.user_id) {
		return res.status(401).json({ Message: "Não autorizado. Sessão inexistente ou inválida." });
	}

	const uid = req.session.user.user_id;
	const { name, email, newPassword } = req.body;

	if (!name && !email && !newPassword) {
		return res.status(400).json({ "Message": "Nenhum campo fornecido para atualizar." });
	}

	const connection = mysql.createConnection(options);
	connection.connect();

	const updates = [];
	const params = [];

	if (name) {
		updates.push("user_name = ?");
		params.push(name);
	}

	if (email) {
		updates.push("user_email = ?");
		params.push(email);
	}

	const doUpdate = () => {
		params.push(uid);
		const sql = mysql.format("UPDATE user SET " + updates.join(", ") + " WHERE user_id = ?", params);
		connection.query(sql, (err, result) => {
			connection.end();
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					return res.status(409).json({ "Message": "Erro - Esse email já está em uso por outra conta." });
				}
				return res.status(500).json({ "Message": `Erro ao atualizar conta: ${err.message}` });
			}
			if (req.session.user) {
				if (name) req.session.user.user_name = name;
				if (email) req.session.user.user_email = email;
			}
			return res.status(200).json({ "Message": "Sucesso - Dados da conta atualizados." });
		});
	};

	if (newPassword) {
		bcrypt.hash(newPassword, 10, (errHash, hash) => {
			if (errHash) {
				connection.end();
				return res.status(500).json({ "Message": "Erro ao gerar hash da password." });
			}
			updates.push("user_password = ?");
			params.push(hash);
			doUpdate();
		});
	} else {
		doUpdate();
	}
};
module.exports.handleUpdate = handleUpdate;

/**
 * Função que elimina a conta do utilizador após confirmação e verificação da password.
 * @param {*} req
 * @param {*} res
 */
const handleDelete = (req, res) => {
	console.log('Delete request body:', req.body);
	const body = req.body || {};
	const confirmed = body.confirmDelete === true || body.confirmDelete === 'true' || body.confirmDelete === 1 || body.confirmDelete === '1';
	if (!confirmed) {
		return res.status(400).json({ "Message": "Confirmação necessária – Tem a certeza de que deseja eliminar a conta?" });
	}
	const email = body.email;
	const password = body.password;
	if (!email || !password) {
		return res.status(400).json({ "Message": "Email e password são obrigatórios para eliminar a conta." });
	}
	const connection = mysql.createConnection(options);
	connection.connect();
	connection.query(
		mysql.format("SELECT user_id, user_password FROM user WHERE user_email = ?", [email]),
		(err, rows) => {
			if (err) {
				connection.end();
				return res.status(500).json({ "Message": `Erro – MySQL query to delete: ${err.message}` });
			}
			if (rows.length === 0) {
				connection.end();
				return res.status(401).json({ "Message": "Erro – Dados inseridos incorretamente." });
			}
			const user = rows[0];
			const uid = user.user_id;

			bcrypt.compare(password, user.user_password, (errB, result) => {
				if (errB) {
					connection.end();
					return res.status(500).json({ "Message": "Erro ao verificar a password." });
				}
				if (!result) {
					connection.end();
					return res.status(401).json({ "Message": "Dados inseridos incorretamente." });
				}

				connection.query(
					mysql.format("DELETE FROM user WHERE user_id = ?", [uid]),
					(errUser, resultUser) => {
						connection.end();
						if (errUser) {
							return res.status(500).json({ "Message": `Erro ao eliminar conta: ${errUser.message}` });
						}
						if (req.session) {
							req.session.destroy(errS => {
								if (errS) {
									res.clearCookie('connect.sid');
									return res.status(200).json({ "Message": "Sucesso – Conta eliminada. (sessão não destruída automaticamente)" });
								}
								res.clearCookie('connect.sid');
								return res.status(200).json({ "Message": "Sucesso – Conta eliminada." });
							});
						} else {
							return res.status(200).json({ "Message": "Sucesso – Conta eliminada." });
						}
					}
				);
			});
		}
	);
};
module.exports.handleDelete = handleDelete;

/**
 * Função que verifica se existe sessões ativas (através dos cookies de sessão).
 * @param {*} req
 * @param {*} res
 */
const handleCheckSession = (req, res) => {
	if (req.session && req.session.user) {
		res.status(200).json({ "Message": "Sessão ativa", "user": req.session.user });
	} else {
		res.status(401).json({ "Message": "Sessão inativa. É necessário login." });
	}
};
module.exports.handleCheckSession = handleCheckSession;

/**
 * Função que retorna a lista de animais da tabela "animal" (atualmente vazia)
 * @param {*} req
 * @param {*} res
 */
const getAnimals = (req, res) => {
	runQuery(res, "SELECT animal_id, animal_name, animal_population, animal_habitat, animal_category FROM animal", "animal");
};
module.exports.getAnimals = getAnimals;

/**
 * (Função que retorna a lista de logs da tabela "logs" (atualmente vazia)
 * @param {*} req
 * @param {*} res
 */
const getLogs = (req, res) => {
	runQuery(res, "SELECT log_id, log_datetime, log_user_id FROM logs", "logs");
};
module.exports.getLogs = getLogs;