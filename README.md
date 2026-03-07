# Animal-Explorer
Projeto para a disciplina de PSW (Programação de Sistemas Web)

### Como Instalar?
**NOTA IMPORTANTE:** Antes de instalar a aplicação, é importante que o Git, o Node.js e um cliente de base de dados (ex: MySQL Workbench) estejam instalados no seu dispositivo, garantindo que a aplicação funcione corretamente sem problemas.

1. Abra o seu terminal.

2. Baixe os arquivos: ```git clone https://github.com/DrMaster7/Animal_Explorer``` (é aqui que o git será necessário).

3. Entre na pasta da aplicação: ```cd Animal_Explorer```.

4. Instale as dependências: ```npm install``` (é aqui que o Node.js será necessário).

5. No seu cliente de base de dados, execute os scripts SQL localizados na pasta /db.

6. Na pasta /scripts do Animal_Explorer (onde está o ficheiro request_handlers.js), crie um ficheiro chamado connectionOptions.json. Copie o código abaixo e substitua os últimos 3 campos pelos seus dados reais:

```
{
  "host": "localhost",
  "user": "(teu_utilizador)",
  "password": "(tua_password, se existir)",
  "database": "(nome_base_de_dados)"
}
```

7. Inicie o servidor: ```npm start``` (é aqui que o Node.js será necessário).

8. Aceda ao website: ```http://localhost:(PORTA INDICADA NO TERMINAL)```.
