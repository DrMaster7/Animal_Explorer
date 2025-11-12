"use strict";
const mysql = require("mysql2"); // Cliente MySQL
const options = require("./connectionOptions.json"); // Configurações de conexão à base de dados
const bcrypt = require("bcrypt"); // Biblioteca para hashing de passwords

/**
 * Executa uma query MySQL e retorna resposta JSON padronizada
 * @param {*} res - Objeto de resposta do Express
 * @param {string} sql - Query SQL a executar
 * @param {string} label - Nome do campo da resposta JSON que conterá os resultados
 */
function runQuery(res, sql, label) {
    const connection = mysql.createConnection(options); // Cria conexão com a base de dados
    connection.connect(); // Abre a conexão
    connection.query(sql, function (err, rows) { // Executa a query
        if (err) { // Se houver erro
            res.status(500).json({ "Message": `Erro - Query MySQL para ${label}`, details: err.message }); // Retorna erro 500 (Internal Server Error)
			return;
		} else { // Se query for bem-sucedida
            res.status(200).json({ "Message": "Sucesso", [label]: rows }); // Retorna sucesso com os resultados
			return;
		}
    });
    connection.end(); // Fecha a conexão
}

/**
 * Novos registos (sign up) de utilizadores
 * @param {*} req
 * @param {*} res
 */
const handleSignup = (req, res) => {
    const name = req.body.name; // Lê nome do corpo da requisição
    const email = req.body.email; // Lê email do corpo da requisição
    const password = req.body.password; // Lê password do corpo da requisição
    const hash = bcrypt.hashSync(password, 10); // Gera hash da password com 10 salt rounds

    const connection = mysql.createConnection(options); // Cria conexão à BD
    connection.connect(); // Abre a conexão
    connection.query(
        mysql.format("INSERT INTO user (user_name, user_email, user_password) VALUES (?, ?, ?)", [name, email, hash]), // Query SQL para inserir o utilizador na base de dados com os valores inseridos pelo mesmo.
        function (err, rows) { // Callback após execução da query
            if (err) { // Se houver erro na query
                if (err.code === 'ER_DUP_ENTRY') { // Se o email já existe
                    res.status(409).json({ "Message": "Erro - Email já em uso por outra conta." }); // Retorna erro 409 (Conflict Error)
					return;
				} else { // Outros erros
                    res.status(500).json({ "Message": `Erro ao fazer registo da conta: ${err.message}` }); // Retorna erro 500 (Internal Server Error)
					return;
				}
            } else { // Se inserção bem-sucedida
                res.status(200).json({ "Message": "Conta registada com sucesso.", "user_id": rows.insertId }); // Retorna com sucesso o aviso da conta criada (com o ID do novo utilizador)
				return;
			}
        }
    );
    connection.end(); // Fecha conexão
};
module.exports.handleSignup = handleSignup;

/**
 * Inícios de sessão (login) dos utilizadores.
 * @param {*} req
 * @param {*} res
 */
const handleLogin = (req, res) => {
    const email = req.body.email; // Lê email
    const password = req.body.password; // Lê password

    const connection = mysql.createConnection(options); // Cria conexão à Base de Dados
    connection.connect(); // Abre conexão
    connection.query(
        mysql.format("SELECT user_id, user_name, user_email, user_password FROM user WHERE user_email = ?", [email]), // Query SQL para selecionar utilizadores do qual o email corresponda ao email inserido pelo utilizador.
        function (err, rows) { // Callback da query
            if (err) { // Se erro na query
                res.status(500).json({ "Message": `Erro ao fazer login da conta: ${err.message}` }); // Retorna erro 500 (Internal Server Error)
                connection.end(); // Fecha conexão
				return;
            }
            if (rows.length === 0) { // Se um utilizador não for encontrado
                res.status(401).json({ "Message": "Credenciais incorretas." }); // Retorna erro 401 (Unauthorized Error)
                connection.end(); // Fecha conexão
				return;
            }
            const user = rows[0]; // Pega o registo do utilizador
            bcrypt.compare(password, user.user_password, function(errB, result) { // Compara a password fornecida com a hash
                if (result === true) { // Se a password estiver correta correta
                    req.session.user = { // Guarda os dados do utilizador na sessão, no caso de ele fechar a aba ou reiniciar a aplicação.
                        user_id: user.user_id,
                        user_name: user.user_name,
                        user_email: user.user_email
                    };
                    delete user.user_password; // Remove a password (por questões de segurança)
                    res.status(200).json({ "Message": "Login realizado com sucesso.", "user": req.session.user }); // Retorna sucesso
					return;
				} else { // Se a password estiver incorreta
                    res.status(401).json({ "Message": "Credenciais incorretas." }); // Retorna erro 401 (Unauthorized Error)
					return;
				}
                connection.end(); // Fecha conexão após comparação
            });
        }
    );
};
module.exports.handleLogin = handleLogin;

/**
 * Términos de sessão (logout) dos utilizadores.
 * @param {*} req
 * @param {*} res
 */
const handleLogout = (req, res) => {
    req.session.destroy(err => { // Destroi a sessão ativa em questão.
        if (err) { // Se houver algum erro
            res.status(500).json({ "Message": "Erro ao fazer logout." }); // Retorna erro 500 (Internal Server Error)
			return;
        }
        res.clearCookie('connect.sid'); // Limpa o cookie.
        res.status(200).json({ "Message": "Logout realizado com sucesso." }); // Retorna sucesso
		return;
    });
};
module.exports.handleLogout = handleLogout;

/**
 * Retorno dos dados do utilizador para a dashboard.
 * @param {*} req
 * @param {*} res
 */
const handleRead = (req, res) => {
	if (!req.session || !req.session.user || !req.session.user.user_id) { // Verifica a existência e a validade da sessão.
		res.status(401).json({ "Message": "Não autorizado. Sessão inexistente ou inválida." }); // Retorna erro 401 (Unauthorized Error) se sessão inválida
		return;
	}

	const uid = req.session.user.user_id; // Id do utilizador
    const connection = mysql.createConnection(options); // Cria conexão à base de dados para buscar os dados do utilizador com sessão iniciada
    connection.connect(); // Abre conexão

	connection.query(
		mysql.format("SELECT user_name, user_email FROM user WHERE user_id = ?", [uid]), // Query SQL para obter os dados do utilizador com o id indicado na sessão
        (err, rows) => { // Callback da query
            connection.end(); // Fecha a conexão quando recebe resposta.
			if (err) {
				res.status(500).json({ "Message": `Erro ao ler dados do utilizador: ${err.message}` }); // Retorna erro 500 (Internal Server Error) em caso de erro na Base de Dados.
				return;
			}
			if (rows.length === 0) {
				res.status(404).json({ "Message": "Utilizador não encontrado." }); // Retorna erro 404 (Not Found Error) se o utilizador não existir.
				return;
			}
			res.status(200).json({ "Message": "Sucesso", "user": rows[0] }); // Retorna os dados do utilizador.
			return;
		}
	);
};
module.exports.handleRead = handleRead;

/**
 * Atualiza os dados da conta de um utilizador (vindo do formulário da dashboard).
 * @param {*} req
 * @param {*} res
 */
const handleUpdate = (req, res) => {
	if (!req.session || !req.session.user || !req.session.user.user_id) { // Verifica a existência e a validade da sessão.
		res.status(401).json({ "Message": "Não autorizado. Sessão inexistente ou inválida." }); // Retorna erro 401 (Unauthorized Error) se sessão inválida.
		return;
	}

	const uid = req.session.user.user_id; // Id do utilizador
	const { name, email, newPassword } = req.body; // Campos fornecidos para atualizar

	if (!name && !email && !newPassword) { // Verifica se há pelo menos um campo para atualizar.
		res.status(400).json({ "Message": "Nenhum campo fornecido para atualizar." }); // Retorna erro 400 (Bad Request Error) se nenhum campo foi fornecido.
		return;
	}

	const connection = mysql.createConnection(options); // Cria conexão à base de dados para executar a atualização dos dados
    connection.connect(); // Abre conexão

	const updates = []; // Segmentos da cláusula SET
    const params = []; // Parâmetros para a query

	if (name) { // Se o nome for preenchido
		updates.push("user_name = ?"); // Adiciona atualização do nome
		params.push(name); // Adiciona parâmetro do nome
	}

	if (email) { // Se o email for preenchido
		updates.push("user_email = ?"); // Adiciona atualização do email
		params.push(email); // Adiciona parâmetro do email
	}

	const doUpdate = () => {
		params.push(uid); // Adiciona o uid como último parâmetro para WHERE
		const sql = mysql.format("UPDATE user SET " + updates.join(", ") + " WHERE user_id = ?", params); // Query SQL com os parâmetros recebidos para atualizar os dados do utilizador na base de dados
		connection.query(sql, (err, result) => { // Executa a query de atualização
			connection.end(); // Fecha a conexão após a execução
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					res.status(409).json({ "Message": "Erro - Credenciais já em uso por outra conta." }); // Retorna erro 409 (Conflict Error) se o nome ou email já for utilizado por outra conta.
					return;
				}
				res.status(500).json({ "Message": `Erro ao atualizar conta: ${err.message}` }); // Retorna erro 500 (Internal Server Error) em caso de erro genérico.
				return;
			}
			if (req.session.user) { // Atualiza os dados na sessão caso existam alterações
				if (name) req.session.user.user_name = name; // Atualiza nome na sessão
				if (email) req.session.user.user_email = email; // Atualiza email na sessão
			}
			res.status(200).json({ "Message": "Dados da conta atualizados com sucesso." }); // Retorna sucesso
			return;
		});
	};

	if (newPassword) { // Se houver password nova 
		bcrypt.hash(newPassword, 10, (errHash, hash) => { // Gera hash assíncrono para a nova password
			if (errHash) {
				connection.end(); // Fecha conexão em caso de erro no hash
				res.status(500).json({ "Message": "Erro ao gerar hash da password." }); // Retorna erro 500 (Internal Server Error) em caso de erro no hash
				return;
			}
			updates.push("user_password = ?"); // Adiciona atualização do campo password
			params.push(hash); // Adiciona hash ao array de parâmetros
			doUpdate(); // Executa a rotina de update já com o hash incluído
		});
	} else {
		doUpdate(); // Executa o update se não há password para atualizar
	}
};
module.exports.handleUpdate = handleUpdate;

/**
 * Eliminar a conta do utilizador (após confirmação e verificação da password).
 * @param {*} req
 * @param {*} res
 */
const handleDelete = (req, res) => {
	if (!req.session || !req.session.user || !req.session.user.user_id) {
    	res.status(401).json({ "Message": "Não autorizado. Sessão inexistente ou inválida." });
		return;
	}
	
	const uid = req.session.user.user_id; // Define o uid da sessão
	const body = req.body || {}; // Garante um objecto body mesmo que não venha no pedido
	const confirmed = body.confirmDelete === true || body.confirmDelete === 'true' || body.confirmDelete === 1 || body.confirmDelete === '1'; // Normaliza formas de confirmação da operação
	if (!confirmed) { // Se não houver confirmação
		res.status(300).json({ "Message": "Confirmação necessária – Tem a certeza de que deseja eliminar a conta?" }); // Retorna 300 (Multiple Choices) se não há confirmação
		return;
	}
	const email = body.email; // Email fornecido para confirmar identidade
	if (!email) {
		res.status(400).json({ "Message": "Email obrigatório para eliminar a conta." }); // Retorna erro 400 (Bad Request Error) se faltar email.
		return;
	}
	const password = body.password; // Password fornecida para confirmar identidade
	if (!password) {
		res.status(400).json({ "Message": "Password obrigatória para eliminar a conta." }); // Retorna erro 400 (Bad Request Error) se faltar password.
		return;
	}
	const connection = mysql.createConnection(options); // Cria conexão à base de dados para verificar e eliminar o utilizador.
	connection.connect(); // Abre conexão
	connection.query(
		mysql.format("SELECT user_id, user_password FROM user WHERE user_email = ?", [email]), // Query para obter id e hash da password pelo email.
		(errA, rows) => {
			if (errA) { // Se erro na query
                res.status(500).json({ "Message": `Erro ao aceder à base de dados: ${errA.message}` }); // Retorna erro 500 (Internal Server Error)
                connection.end(); // Fecha conexão
				return;
            }
            if (rows.length === 0) { // Se um utilizador não for encontrado
                res.status(401).json({ "Message": "Credenciais incorretas." }); // Retorna erro 401 (Unauthorized Error) se dados não corresponderem
                connection.end(); // Fecha conexão
				return;
            }
			const user = rows[0]; // Pega o utilizador encontrado.

			bcrypt.compare(password, user.user_password, (errB, result) => { // Compara a password fornecida com o hash guardado.
				if (errB) {
					res.status(500).json({ "Message": "Erro ao verificar a password." }); // Retorna erro 500 (Internal Server Error) se houver erro a verificar password
					connection.end(); // Fecha conexão
					return;
				}
				if (!result) {
					res.status(401).json({ "Message": "Credenciais incorretas." }); // Retorna erro 401 (Unauthorized Error) se autenticação falhou.
					connection.end(); // Fecha conexão
					return;
				}
				connection.query(
					mysql.format("DELETE FROM user WHERE user_id = ?", [uid]), // Query para eliminar o utilizador pelo id
					(errUser, resultUser) => {
						connection.end(); // Fecha conexão após tentativa de delete
						if (errUser) {
							res.status(500).json({ "Message": `Erro ao eliminar conta: ${errUser.message}` }); // Retorna erro 500 (Internal Server Error) se falha ao eliminar
							return;
						}
						if (req.session) { // Se existe sessão, tenta destruí-la depois do delete
							req.session.destroy(errS => {
								if (errS) { // Se houver erro a eliminar a sessão
									res.clearCookie('connect.sid'); // Mesmo que não consiga destruir, limpa cookie no cliente
									res.status(200).json({ "Message": "Conta eliminada com sucesso." }); // Retorna sucesso (se havia sessão e não foi destruída)
									return;
								}
								res.clearCookie('connect.sid'); // Limpa cookie se sessão destruída com sucesso
								res.status(200).json({ "Message": "Conta eliminada com sucesso." }); // Retorna sucesso (se havia sessão e foi destruída)
								return;
							});
						} else {
							res.status(200).json({ "Message": "Conta eliminada com sucesso." }); // Retorna sucesso (se não havia sessão)
							return;
						}
					}
				);
			});
		}
	);
};
module.exports.handleDelete = handleDelete;

/**
 * Verifica existência de sessões ativas (através do cookie de sessão).
 * @param {*} req
 * @param {*} res
 */
const handleCheckSession = (req, res) => {
	if (req.session && req.session.user) { // Verifica se existe sessão e user na sessão
		res.status(200).json({ sessionActive: true, user: req.session.user }); // Retorna sucesso (com dados da sessão).
		return;
	} else {
		res.status(401).json({ sessionActive: false, message: "Sessão inativa. É necessário login." }); // Retorna erro 401 (Unauthorized Error) se não houver sessão.
		return;
	}
};
module.exports.handleCheckSession = handleCheckSession;

/**
 * Retorna a lista de animais da tabela "animal"
 * @param {*} req
 * @param {*} res
 */
const getAnimals = (req, res) => {
	const category = req.query.category; // Retorna a categoria de animal pedida
	let sql = "SELECT animal_id, animal_name, animal_population, animal_status, animal_status_class, animal_description, animal_image_url, animal_habitat, animal_category FROM animal";

    if (category) { // Se a categoria for fornecida, adiciona a cláusula WHERE
        sql += mysql.format(" WHERE animal_category = ?", [category]);
    }
	runQuery(res, sql, "animal"); // Chama a função runQuery para obter os animais na base de dados.
};
module.exports.getAnimals = getAnimals;

/**
 * (Função que retorna a lista de logs da tabela "logs" (vazia)
 * @param {*} req
 * @param {*} res
 */
const getLogs = (req, res) => {
	runQuery(res, "SELECT log_id, log_datetime, log_user_id FROM logs", "logs"); // Chama a função runQuery para obter logs (não irá retornar nada pela tabela estar vazia).
};
module.exports.getLogs = getLogs;