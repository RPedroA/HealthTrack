const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidFullName(full_name) {
  return full_name && full_name.length >= 3; // Verifica se o nome completo tem pelo menos 3 caracteres
}

const createUser = async (req, res) => {
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

  if (typeof username !== "string") {
    invalidParams.push("username (deve ser string)");
  } else if (username.split(" ").length < 3) {
    invalidParams.push("username (deve ter pelo menos 3 palavras)");
  }
  if (typeof email !== "string") {
    invalidParams.push("email (deve ser string)");
  } else if (!isValidEmail(email)) {
    invalidParams.push("email (formato inválido)");
  }
  if (typeof password_hash !== "string") {
    invalidParams.push("password_hash (deve ser string)");
  } else if (password_hash.length < 6) {
    invalidParams.push("password_hash (mínimo de 6 caracteres)");
  }
  if (full_name !== undefined && typeof full_name !== "string") {
    invalidParams.push("full_name (deve ser string)");
  } else if (full_name && !isValidFullName(full_name)) {
    invalidParams.push("full_name (deve ter pelo menos 3 caracteres)");
  }

  if (invalidParams.length > 0) {
    return res.status(400).json({
      erro: "Campos inválidos",
      detalhes: invalidParams,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const user = await prisma.users.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
        full_name: full_name,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Erro ao criar utilizador:", error.message);

    if (error.code === "P2002") {
      return res.status(400).json({
        erro: "Username ou Email já existem",
        detalhes: error.message,
      });
    }

    res.status(500).json({
      erro: "Não foi possível criar o utilizador.",
      detalhes: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar utilizadores:", error.message);
    res.status(500).json({
      erro: "Não foi possível obter os utilizadores.",
      detalhes: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número.",
    });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id: numericId },
    });

    if (!user) {
      return res.status(404).json({
        erro: `Utilizador com ID ${numericId} não encontrado.`,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(`Erro ao buscar utilizador com ID ${id}:`, error.message);
    res.status(500).json({
      erro: "Erro ao buscar utilizador.",
      detalhes: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  const { username, email, password_hash, full_name } = req.body;
  const dataToUpdate = {};
  const invalidParams = [];

  if (username !== undefined) {
    if (typeof username !== "string") {
      invalidParams.push("username (deve ser string)");
    } else if (username.split(" ").length < 3) {
      invalidParams.push("username (deve ter pelo menos 3 palavras)");
    } else {
      dataToUpdate.username = username;
    }
  }

  if (email !== undefined) {
    if (typeof email !== "string") {
      invalidParams.push("email (deve ser string)");
    } else if (!isValidEmail(email)) {
      invalidParams.push("email (formato inválido)");
    } else {
      dataToUpdate.email = email;
    }
  }

  if (password_hash !== undefined) {
    if (typeof password_hash !== "string") {
      invalidParams.push("password_hash (deve ser string)");
    } else if (password_hash.length < 6) {
      invalidParams.push("password_hash (mínimo de 6 caracteres)");
    } else {
      const hashed = await bcrypt.hash(password_hash, 10);
      dataToUpdate.password_hash = hashed;
    }
  }

  if (full_name !== undefined) {
    if (typeof full_name !== "string") {
      invalidParams.push("full_name (deve ser string)");
    } else if (!isValidFullName(full_name)) {
      invalidParams.push("full_name (deve ter pelo menos 3 caracteres)");
    } else {
      dataToUpdate.full_name = full_name;
    }
  }

  if (invalidParams.length > 0) {
    return res.status(400).json({
      erro: "Campos inválidos para atualização",
      detalhes: invalidParams,
    });
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return res.status(400).json({
      erro: "Não há dados para atualizar.",
    });
  }

  try {
    const updatedUser = await prisma.users.update({
      where: { id: numericId },
      data: dataToUpdate,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Erro ao atualizar utilizador com ID ${id}:`, error.message);
    if (error.code === "P2002") {
      return res.status(400).json({
        erro: "Username ou Email já existem",
        detalhes: error.message,
      });
    }
    res.status(500).json({
      erro: "Não foi possível atualizar o utilizador.",
      detalhes: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido.",
    });
  }

  try {
    await prisma.users.delete({
      where: { id: numericId },
    });

    return res.status(200).json({
      mensagem: `Utilizador com ID ${numericId} foi apagado com sucesso.`,
    });
  } catch (error) {
    console.error(`Erro ao apagar utilizador com ID ${id}:`, error.message);
    return res.status(500).json({
      erro: "Não foi possível apagar o utilizador.",
      detalhes: error.message,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
