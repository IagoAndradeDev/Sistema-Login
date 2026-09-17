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

app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor rodando em http://localhost:3000");
});