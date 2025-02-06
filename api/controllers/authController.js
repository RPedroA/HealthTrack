const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { tokenBlacklist } = require("../utils/tokenBlacklist");

const prisma = new PrismaClient();

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const registerUser = async (req, res) => {
  const { username, email, password_hash, full_name } = req.body;

  const missingParams = [];
  const invalidParams = [];

  if (!username) missingParams.push("username");
  if (!email) missingParams.push("email");
  if (!password_hash) missingParams.push("password_hash");

  if (missingParams.length > 0) {
    return res.status(400).json({
      erro: "Parâmetros obrigatórios ausentes",
      detalhes: { missingParams },
    });
  }

  // Verificação dos dados
  if (typeof username !== "string" || username.length < 3) {
    invalidParams.push("username (deve ter pelo menos 3 caracteres)");
  }
  if (typeof email !== "string" || !isValidEmail(email)) {
    invalidParams.push("email (formato inválido)");
  }
  if (typeof password_hash !== "string" || password_hash.length < 6) {
    invalidParams.push("password_hash (mínimo de 6 caracteres)");
  }
  if (
    full_name !== undefined &&
    (typeof full_name !== "string" || full_name.length < 5)
  ) {
    invalidParams.push("full_name (deve ter pelo menos 5 caracteres)");
  }

  if (invalidParams.length > 0) {
    return res.status(400).json({
      erro: "Campos inválidos",
      detalhes: invalidParams,
    });
  }

  try {
    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        erro: "Email já está em uso",
      });
    }

    // Encripta a password_hash
    const hashedpassword_hash = await bcrypt.hash(password_hash, 10);

    // Cria o utilizador na base de dados
    const user = await prisma.users.create({
      data: {
        username,
        email,
        password_hash: hashedpassword_hash,
        full_name,
      },
    });

    // Cria o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error("Erro ao criar utilizador:", error.message);

    if (error.code === "P2002") {
      return res.status(400).json({
        erro: "Username ou Email já existe",
        detalhes: error.message,
      });
    }

    return res.status(500).json({
      erro: "Erro ao criar o utilizador",
      detalhes: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password_hash } = req.body;

  const missingParams = [];
  const invalidParams = [];

  if (!email) missingParams.push("email");
  if (!password_hash) missingParams.push("password_hash");

  if (missingParams.length > 0) {
    return res.status(400).json({
      erro: "Parâmetros obrigatórios ausentes",
      detalhes: { missingParams },
    });
  }

  if (typeof email !== "string" || !isValidEmail(email)) {
    invalidParams.push("email (formato inválido)");
  }
  if (typeof password_hash !== "string" || password_hash.length < 6) {
    invalidParams.push("password_hash (mínimo de 6 caracteres)");
  }

  if (invalidParams.length > 0) {
    return res.status(400).json({
      erro: "Campos inválidos",
      detalhes: invalidParams,
    });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ erro: "Usuário não encontrado." });
    }

    // Verifica a password_hash
    const password_hashIsValid = await bcrypt.compare(password_hash, user.password_hash);
    if (!password_hashIsValid) {
      return res.status(400).json({ erro: "Senha incorreta." });
    }

    // Cria o token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Erro no login:", error.message);
    return res.status(500).json({
      erro: "Erro no login",
      detalhes: error.message,
    });
  }
};

const logoutUser = (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(400).json({ erro: "Token não fornecido" });
  }

  try {
    const tokenValue = token.startsWith("Bearer ") ? token.slice(7) : token;

    // Adiciona o token a blacklist
    tokenBlacklist.add(tokenValue);

    return res.status(200).json({
      mensagem: "Logout realizado com sucesso. Token invalidado.",
    });
  } catch (error) {
    console.error("Erro no logout:", error.message);
    return res.status(500).json({
      erro: "Erro ao realizar o logout.",
      detalhes: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
