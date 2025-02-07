require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const router = require("./api/routes/");

const app = express();

// Middleware para JSON
app.use(bodyParser.json());

// Servir imagens 
app.use("/images", express.static(path.join(__dirname, "images")));

// Rotas principais
app.use(router);

// Rota de verificação do servidor
app.get("/ping", (req, res) => {
    res.status(200).json({ message: "🙂 O servidor está a funcionar!" });
});

// Logout
app.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout realizado com sucesso!" });
});

// Iniciar o servidor 
const port = process.env.PORT || 8080;
if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => console.log(`Servidor a correr na porta ${port}`));
}

// Exportar a app para Vercel
module.exports = app;
