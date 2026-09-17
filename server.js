const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("database/accounts.db");


app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`);

app.get("/accounts", (req, res) => {
  const usuarios = db.prepare("SELECT * FROM accounts").all();
  res.json(usuarios);
});

app.post("/accounts", (req, res) => {
  const { nome, password, email } = req.body;

  try {
    const existe = db
      .prepare("SELECT * FROM accounts WHERE user = ? OR email = ?")
      .get(nome, email);

    if (existe) {
      if (existe.user === nome) {
        return res.status(409).json({
          erro: "Esse usuario já existe!"
        });
      }

      if (existe.email === email) {
        return res.status(409).json({
          erro: "Esse email já está sendo usado!"
        });
      }
    }

    const result = db
      .prepare(
        "INSERT INTO accounts (user, password, email) VALUES (?, ?, ?)"
      )
      .run(nome, password, email);

    res.status(201).json({
      id: result.lastInsertRowid,
      nome,
      email
    });

  } catch (error) {
    res.status(400).json({
      erro: error.message
    });
  }
});


app.post("/login", (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({
            erro: "Insira seu usuario e senha!"
        });
    }

    try {
        const usuario = db
            .prepare("SELECT * FROM accounts WHERE user = ?")
            .get(user);

        if (!usuario) {
            return res.status(401).json({
                erro: "Esse usuario não existe!"
            });
        }

        if (usuario.password !== password) {
            return res.status(401).json({
                erro: "Senha incorreta!"
            });
        }

        res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            usuario: {
                id: usuario.id,
                nome: usuario.user,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro interno do servidor."
        });
    }
});


app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor rodando em http://localhost:3000");
});