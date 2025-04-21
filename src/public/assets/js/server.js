import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src/public')));

let db;

(async () => {
  db = await open({
    filename: './admin/database/users.db',
    driver: sqlite3.Database
  });

  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
})();

// Rota de cadastro
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
      username,
      email,
      password
    ]);
    res.json({ success: true, message: "Usuário cadastrado com sucesso" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// Rota de login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [
    email,
    password
  ]);

  if (user) {
    res.json({ success: true, user });
  } else {
    res.json({ success: false, message: "Email ou senha inválidos" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
export default app;
export { db };
export { __dirname };
export { port };
export { fileURLToPath };
export { express };
export { sqlite3 };
export { open };