"use strict";
const mysql = require("mysql2"); // Importa o cliente MySQL2.
const options = require("./connectionOptions.json"); // Carrega opções de conexão com a BD a partir de ficheiro.
const bcrypt = require("bcrypt"); // Importa bcrypt para hashing de passwords.

/**
 * Função que executa uma query MySQL e envia resposta JSON uniforme 
 * @param {*} res
 * @param {string} sql
 * @param {string} label
 */
function runQuery(res, sql, label) {
	const connection = mysql.createConnection(options); // Cria nova conexão MySQL com as opções fornecidas.
	connection.connect(); // Abre a ligação à base de dados.
	connection.query(sql, function (err, rows) { // Executa a query recebida.
		if (err) {
			console.error(`Erro na query MySQL para ${label}: ${err.message}`); // Adicione log para debug
            res.status(500).json({ "Message": `Error - MySQL query to ${label}`, details: err.message }); // Retorna 500
		} else {
			res.status(200).json({ "Message": "Success", [label]: rows }); // Retorna sucesso com os dados da query no campo identificado por label.
		}
	});
	connection.end(); // Fecha a conexão à base de dados.
}

/**
 * Função que lida com novos registos de utilizadores via POST
 * @param {*} req
 * @param {*} res
 */
const handleSignup = (req, res) => {
	const name = req.body.name; // Lê o nome enviado no corpo do pedido.
	const email = req.body.email; // Lê o email enviado no corpo do pedido.
	const password = req.body.password; // Lê a password enviada no corpo do pedido.
	const hash = bcrypt.hashSync(password, 10); // Gera hash síncrono da password com salt rounds 10.

	const connection = mysql.createConnection(options); // Cria conexão à BD para inserir o utilizador.
	connection.connect(); // Abre a ligação.
	connection.query(
		mysql.format("INSERT INTO user (user_name, user_email, user_password) VALUES (?, ?, ?)", [name, email, hash]), // Query preparada para inserir dados do utilizador.
		function (err, rows, fields) {
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					res.status(409).json({ "Message": "Erro - Outra conta já utiliza esse email." }); // Retorna 409 quando o email já existe (unique key).
				} else {
					res.status(500).json({ "Message": `Erro - MySQL query to signup: ${err.message}` }); // Retorna 500 com a mensagem de erro da BD.
				}
			} else {
				res.status(200).json({ "Message": "Sucesso - Conta registada no Animal Explorer. Bem-vindo.", "user_id": rows.insertId }); // Retorna sucesso e o id do novo utilizador.
			}
		}
	);
	connection.end(); // Fecha a conexão após a operação.
};
module.exports.handleSignup = handleSignup; // Exporta a função de signup.

/**
 * Função que lida com os inícios de sessão (login) dos utilizadores via POST.
 * @param {*} req
 * @param {*} res
 */
const handleLogin = (req, res) => {
	const email = req.body.email; // Lê o email enviado no corpo do pedido.
	const password = req.body.password; // Lê a password enviada no corpo do pedido.

	const connection = mysql.createConnection(options); // Cria conexão à BD para verificar credenciais.
	connection.connect(); // Abre ligação.
	connection.query(
		mysql.format("SELECT user_id, user_name, user_email, user_password FROM user WHERE user_email = ?", [email]), // Query preparada para obter dados do utilizador por email.
		function (err, rows) {
			if (err) {
				res.status(500).json({ "Message": `Error - MySQL query to login: ${err.message}` }); // Retorna 500 se houve erro na query.
				connection.end(); // Fecha a conexão em caso de erro.
				return; // Sai da função.
			}
			if (rows.length === 0) {
				res.status(401).json({ "Message": "Erro - Dados inseridos incorretamente." }); // Retorna 401 se não existe utilizador com esse email.
				connection.end(); // Fecha a conexão.
				return; // Sai da função.
			}
			const user = rows[0]; // Pega o primeiro registo retornado (deverá ser único).
			bcrypt.compare(password, user.user_password, function(errB, result) { // Compara password fornecida com hash guardado.
				if (result === true) {
					req.session.user = {
						user_id: user.user_id, // Guarda o id do utilizador na sessão.
						user_name: user.user_name, // Guarda o nome do utilizador na sessão.
						user_email: user.user_email // Guarda o email do utilizador na sessão.
					};
					delete user.user_password; // Remove a password do objecto user por segurança.
					res.status(200).json({ "Message": "Sucesso - Login bem-sucedido. Bem-vindo.", "user": req.session.user }); // Retorna sucesso com dados da sessão.
				} else {
					res.status(401).json({ "Message": "Dados inseridos incorretamente." }); // Retorna 401 se a password não corresponder.
				}
				connection.end(); // Fecha a conexão após comparação.
				return; // Sai da callback.
			});
		}
	);
};
module.exports.handleLogin = handleLogin; // Exporta a função de login.

/**
 * Função que lida com os términos de sessão (logout) dos utilizadores.
 * @param {*} req
 * @param {*} res
 */
const handleLogout = (req, res) => {
	req.session.destroy(err => { // Destroi a sessão atual no servidor.
		if (err) {
			return res.status(500).json({ "Message": "Erro ao fazer logout." }); // Retorna 500 se ocorreu erro a destruir a sessão.
		}
		res.clearCookie('connect.sid'); // Limpa o cookie de sessão no cliente.
		res.status(200).json({ "Message": "Sucesso - Logout bem-sucedido." }); // Retorna sucesso.
	});
};
module.exports.handleLogout = handleLogout; // Exporta a função de logout.

/**
 * Função que retorna os dados do utilizador para a dashboard.
 * @param {*} req
 * @param {*} res
 */
const handleRead = (req, res) => {
	if (!req.session || !req.session.user || !req.session.user.user_id) { // Verifica existência e validade da sessão.
		return res.status(401).json({ Message: "Não autorizado. Sessão inexistente ou inválida." }); // Retorna 401 se sessão inválida.
	}
	const uid = req.session.user.user_id; // Obtém o id do utilizador da sessão.
	const connection = mysql.createConnection(options); // Cria conexão à BD para ler dados do utilizador.
	connection.connect(); // Abre ligação.

	connection.query(
		mysql.format("SELECT user_name, user_email FROM user WHERE user_id = ?", [uid]), // Query preparada para obter nome e email pelo id.
		(err, rows) => {
			connection.end(); // Fecha a conexão quando recebe resposta.
			if (err) {
				return res.status(500).json({ "Message": `Erro ao ler dados do utilizador: ${err.message}` }); // Retorna 500 em caso de erro na BD.
			}
			if (rows.length === 0) {
				return res.status(404).json({ "Message": "Utilizador não encontrado." }); // Retorna 404 se o utilizador não existe.
			}
			const user = rows[0]; // Pega o registo do utilizador.
			console.log("Dados do utilizador:", user); // Loga os dados do utilizador no servidor para debugging.
			res.status(200).json({ "Message": "Sucesso", "user": user }); // Retorna os dados do utilizador.
		}
	);
};
module.exports.handleRead = handleRead; // Exporta a função de leitura de dados.

/**
 * Função que atualiza os dados da conta de um utilizador via PUT.
 * @param {*} req
 * @param {*} res
 */
const handleUpdate = (req, res) => {
	if (!req.session || !req.session.user || !req.session.user.user_id) { // Verifica sessão válida.
		return res.status(401).json({ Message: "Não autorizado. Sessão inexistente ou inválida." }); // Retorna 401 caso contrário.
	}

	const uid = req.session.user.user_id; // Id do utilizador da sessão.
	const { name, email, newPassword } = req.body; // Extrai campos a atualizar do corpo do pedido.

	if (!name && !email && !newPassword) { // Verifica se há pelo menos um campo para atualizar.
		return res.status(400).json({ "Message": "Nenhum campo fornecido para atualizar." }); // Retorna 400 se nenhum campo foi fornecido.
	}

	const connection = mysql.createConnection(options); // Cria conexão à BD para executar update.
	connection.connect(); // Abre a ligação.

	const updates = []; // Array para armazenar segmentos da cláusula SET.
	const params = []; // Parâmetros correspondentes para query preparada.

	if (name) {
		updates.push("user_name = ?"); // Adiciona atualização do nome.
		params.push(name); // Adiciona parâmetro do nome.
	}

	if (email) {
		updates.push("user_email = ?"); // Adiciona atualização do email.
		params.push(email); // Adiciona parâmetro do email.
	}

	const doUpdate = () => {
		params.push(uid); // Adiciona o uid como último parâmetro para WHERE.
		const sql = mysql.format("UPDATE user SET " + updates.join(", ") + " WHERE user_id = ?", params); // Prepara a query de UPDATE com os parâmetros.
		connection.query(sql, (err, result) => { // Executa a query de atualização.
			connection.end(); // Fecha a conexão após a execução.
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					return res.status(409).json({ "Message": "Erro - Esse email já está em uso por outra conta." }); // Retorna 409 se email duplicado.
				}
				return res.status(500).json({ "Message": `Erro ao atualizar conta: ${err.message}` }); // Retorna 500 em caso de erro genérico.
			}
			if (req.session.user) { // Atualiza os dados na sessão caso existam alterações.
				if (name) req.session.user.user_name = name; // Atualiza nome na sessão.
				if (email) req.session.user.user_email = email; // Atualiza email na sessão.
			}
			return res.status(200).json({ "Message": "Sucesso - Dados da conta atualizados." }); // Retorna sucesso.
		});
	};

	if (newPassword) {
		bcrypt.hash(newPassword, 10, (errHash, hash) => { // Gera hash assíncrono para a nova password.
			if (errHash) {
				connection.end(); // Fecha conexão em caso de erro no hash.
				return res.status(500).json({ "Message": "Erro ao gerar hash da password." }); // Retorna 500 se falha no hash.
			}
			updates.push("user_password = ?"); // Adiciona atualização do campo password.
			params.push(hash); // Adiciona hash ao array de parâmetros.
			doUpdate(); // Executa a rotina de update já com o hash incluído.
		});
	} else {
		doUpdate(); // Executa o update se não há password para atualizar.
	}
};
module.exports.handleUpdate = handleUpdate; // Exporta a função de atualização.

/**
 * Função que elimina a conta do utilizador após confirmação e verificação da password.
 * @param {*} req
 * @param {*} res
 */
const handleDelete = (req, res) => {
	console.log('Delete request body:', req.body); // Log do body para debug de pedidos de delete.
	const body = req.body || {}; // Garante um objecto body mesmo que não venha no pedido.
	const confirmed = body.confirmDelete === true || body.confirmDelete === 'true' || body.confirmDelete === 1 || body.confirmDelete === '1'; // Normaliza diferentes formas de confirmação.
	if (!confirmed) {
		return res.status(400).json({ "Message": "Confirmação necessária – Tem a certeza de que deseja eliminar a conta?" }); // Retorna 400 se não há confirmação.
	}
	const email = body.email; // Email fornecido para confirmar identidade.
	const password = body.password; // Password fornecida para confirmar identidade.
	if (!email || !password) {
		return res.status(400).json({ "Message": "Email e password são obrigatórios para eliminar a conta." }); // Retorna 400 se faltar email ou password.
	}
	const connection = mysql.createConnection(options); // Cria conexão à BD para verificar e eliminar o utilizador.
	connection.connect(); // Abre ligação.
	connection.query(
		mysql.format("SELECT user_id, user_password FROM user WHERE user_email = ?", [email]), // Query para obter id e hash da password pelo email.
		(err, rows) => {
			if (err) {
				connection.end(); // Fecha conexão em caso de erro.
				return res.status(500).json({ "Message": `Erro – MySQL query to delete: ${err.message}` }); // Retorna 500 com a mensagem de erro.
			}
			if (rows.length === 0) {
				connection.end(); // Fecha conexão se não encontrou o utilizador.
				return res.status(401).json({ "Message": "Erro – Dados inseridos incorretamente." }); // Retorna 401 se não encontrado.
			}
			const user = rows[0]; // Pega o utilizador encontrado.
			const uid = user.user_id; // Extrai o id do utilizador.

			bcrypt.compare(password, user.user_password, (errB, result) => { // Compara a password fornecida com o hash guardado.
				if (errB) {
					connection.end(); // Fecha conexão em caso de erro no bcrypt.
					return res.status(500).json({ "Message": "Erro ao verificar a password." }); // Retorna 500 se houve erro a verificar password.
				}
				if (!result) {
					connection.end(); // Fecha conexão se a password não corresponder.
					return res.status(401).json({ "Message": "Dados inseridos incorretamente." }); // Retorna 401 se autenticação falhou.
				}

				connection.query(
					mysql.format("DELETE FROM user WHERE user_id = ?", [uid]), // Query para eliminar o utilizador pelo id.
					(errUser, resultUser) => {
						connection.end(); // Fecha conexão após tentativa de delete.
						if (errUser) {
							return res.status(500).json({ "Message": `Erro ao eliminar conta: ${errUser.message}` }); // Retorna 500 se falha ao eliminar.
						}
						if (req.session) { // Se existe sessão, tenta destruí-la depois do delete.
							req.session.destroy(errS => {
								if (errS) {
									res.clearCookie('connect.sid'); // Mesmo que não consiga destruir, limpa cookie no cliente.
									return res.status(200).json({ "Message": "Sucesso – Conta eliminada. (sessão não destruída automaticamente)" }); // Informa que conta foi eliminada apesar do problema na sessão.
								}
								res.clearCookie('connect.sid'); // Limpa cookie se sessão destruída com sucesso.
								return res.status(200).json({ "Message": "Sucesso – Conta eliminada." }); // Retorna sucesso final.
							});
						} else {
							return res.status(200).json({ "Message": "Sucesso – Conta eliminada." }); // Retorna sucesso se não havia sessão.
						}
					}
				);
			});
		}
	);
};
module.exports.handleDelete = handleDelete; // Exporta a função de delete.

/**
 * Função que verifica se existe sessões ativas (através dos cookies de sessão).
 * @param {*} req
 * @param {*} res
 */
const handleCheckSession = (req, res) => {
	if (req.session && req.session.user) { // Verifica se existe sessão e user na sessão.
		res.status(200).json({ sessionActive: true, user: req.session.user }); // Retorna 200 com dados da sessão.
	} else {
		res.status(401).json({ sessionActive: false, message: "Sessão inativa. É necessário login." }); // Retorna 401 se sem sessão.
	}
};
module.exports.handleCheckSession = handleCheckSession; // Exporta a função de verificação de sessão.

/**
 * Função que retorna a lista de animais da tabela "animal" (atualmente vazia)
 * @param {*} req
 * @param {*} res
 */
const getAnimals = (req, res) => {
	const category = req.query.category;
	let sql = "SELECT animal_id, animal_name, animal_population, animal_status, animal_status_class, animal_description, animal_image_url, animal_habitat, animal_category FROM animal";

    if (category) { // Se a categoria for fornecida, adiciona a cláusula WHERE
        sql += mysql.format(" WHERE animal_category = ?", [category]); // Usamos mysql.format para sanitizar o input e evitar SQL Injection
    }

	runQuery(res, sql, "animal"); // Chama runQuery para obter animais.
};
module.exports.getAnimals = getAnimals; // Exporta função que obtém animais.

/**
 * (Função que retorna a lista de logs da tabela "logs" (atualmente vazia)
 * @param {*} req
 * @param {*} res
 */
const getLogs = (req, res) => {
	runQuery(res, "SELECT log_id, log_datetime, log_user_id FROM logs", "logs"); // Chama runQuery para obter logs.
};
module.exports.getLogs = getLogs; // Exporta função que obtém logs.