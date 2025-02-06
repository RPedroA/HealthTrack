const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//Cria um novo objetivo

const createGoal = async (req, res) => {
  const { user_id, title, description, target_value, status } = req.body;

  if (!user_id || !title) {
    return res.status(400).json({ erro: "user_id e title são obrigatórios" });
  }

  try {
    const newGoal = await prisma.goals.create({
      data: {
        user_id,
        title,
        description,
        target_value,
        status,
      },
    });

    return res.status(201).json(newGoal);
  } catch (error) {
    console.error("Erro ao criar objetivo:", error.message);
    return res
      .status(500)
      .json({ erro: "Falha ao criar objetivo", detalhes: error.message });
  }
};

//Obtem todos os objetivos
const getAllGoals = async (req, res) => {
  try {
    const goals = await prisma.goals.findMany();
    return res.status(200).json(goals);
  } catch (error) {
    console.error("Erro ao buscar objetivos:", error.message);
    return res.status(500).json({
      erro: "Não foi possível buscar os objetivos",
      detalhes: error.message,
    });
  }
};

//Atualiza um objetivo por id
const updateGoal = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  const { title, description, target_value, status } = req.body;

  try {
    const updatedGoal = await prisma.goals.update({
      where: { id: numericId },
      data: { title, description, target_value, status },
    });

    return res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("Erro ao atualizar objetivo:", error.message);
    return res
      .status(500)
      .json({ erro: "Falha ao atualizar objetivo", detalhes: error.message });
  }
};

//remove um objetivo por id
const deleteGoal = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    await prisma.goals.delete({ where: { id: numericId } });
    return res.status(200).json({
      mensagem: `Objetivo com ID ${numericId} foi removido com sucesso.`,
    });
  } catch (error) {
    console.error("Erro ao apagar objetivo:", error.message);
    return res
      .status(500)
      .json({ erro: "Falha ao apagar objetivo", detalhes: error.message });
  }
};

const searchGoals = async (req, res) => {
  const { query, date, startDate, endDate, user_id } = req.query;

  // Verifica se o parâmetro 'user_id' foi fornecido
  if (!user_id) {
    return res.status(400).json({
      erro: "O parâmetro 'user_id' é obrigatório para a pesquisa.",
    });
  }

  const filters = {
    user_id: parseInt(user_id, 10),  // Garante que o 'user_id' seja tratado como um número
  };

  // Filtra pelo título, caso o parâmetro 'query' seja fornecido
  if (query) {
    filters.title = {
      contains: query,
      mode: "insensitive",
    };
  }

  // Filtra pela data específica, caso o parâmetro 'date' seja fornecido
  if (date) {
    filters.created_at = {
      equals: new Date(date),
    };
  }

  // Filtra pelo intervalo de datas, caso os parâmetros 'startDate' e 'endDate' sejam fornecidos
  if (startDate && endDate) {
    filters.created_at = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  if (Object.keys(filters).length === 1 && filters.user_id) {
    // Se nenhum outro filtro for fornecido, retorna erro, pois 'query', 'date' ou 'startDate'/'endDate' são obrigatórios.
    return res.status(400).json({
      erro:
        "Ao menos um dos parâmetros 'query', 'date', ou 'startDate' e 'endDate' devem ser fornecidos para a pesquisa.",
    });
  }

  try {
    const goals = await prisma.goals.findMany({
      where: filters,
    });

    return res.status(200).json(goals);
  } catch (error) {
    console.error("Erro ao pesquisar objetivos:", error.message);
    return res.status(500).json({
      erro: "Não foi possível realizar a pesquisa",
      detalhes: error.message,
    });
  }
};


module.exports = {
  createGoal,
  getAllGoals,
  updateGoal,
  deleteGoal,
  searchGoals,
};
