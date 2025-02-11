const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//Criar uma atividade fisica
const createPhysicalActivity = async (req, res) => {
  const { user_id, date, activity_type, duration_minutes, calories_burned } = req.body;

  const missingParams = [];
  const invalidParams = [];

  if (!user_id) {
    missingParams.push("user_id");
  } else if (typeof user_id !== "number") {
    invalidParams.push("user_id deve ser um número");
  }

  if (!date) {
    missingParams.push("date");
  } else if (isNaN(new Date(date))) {
    invalidParams.push("date deve ser uma data válida");
  }

  if (!activity_type) {
    missingParams.push("activity_type");
  }
  if (duration_minutes !== undefined && duration_minutes < 0) {
    invalidParams.push("duration_minutes não pode ser negativo");
  }
  if (calories_burned !== undefined && calories_burned < 0) {
    invalidParams.push("calories_burned não pode ser negativo");
  }

  if (missingParams.length > 0) {
    return res.status(400).json({
      erro: "Parâmetros obrigatórios ausentes",
      detalhes: missingParams,
    });
  }

  if (invalidParams.length > 0) {
    return res.status(400).json({
      erro: "Parâmetros inválidos",
      detalhes: invalidParams,
    });
  }

  try {
    const newActivity = await prisma.physical_activities.create({
      data: {
        user_id,
        date: new Date(date),
        activity_type,
        duration_minutes,
        calories_burned,
      },
    });

    return res.status(201).json(newActivity);

  } catch (error) {
    console.error("Erro ao criar atividade física:", error.message);
    return res.status(500).json({
      erro: "Falha ao processar atividade física",
      detalhes: error.message,
    });
  }
};

//Obter todos
const getAllPhysicalActivities = async (req, res) => {
  try {
    const activities = await prisma.physical_activities.findMany();
    return res.status(200).json(activities);
  } catch (error) {
    console.error("Erro ao buscar atividades físicas:", error.message);
    return res.status(500).json({
      erro: "Não foi possível buscar as atividades físicas",
      detalhes: error.message,
    });
  }
};

//atualiza por id
const updatePhysicalActivity = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ erro: "ID inválido", detalhes: "O ID deve ser um número válido" });
  }

  const { activity_type, duration_minutes, calories_burned } = req.body;

  const dataToUpdate = {};

  if (activity_type !== undefined) {
    dataToUpdate.activity_type = activity_type;
  }
  if (duration_minutes !== undefined && duration_minutes >= 0) {
    dataToUpdate.duration_minutes = duration_minutes;
  }
  if (calories_burned !== undefined && calories_burned >= 0) {
    dataToUpdate.calories_burned = calories_burned;
  }

  try {
    const updatedActivity = await prisma.physical_activities.update({
      where: { id: numericId },
      data: dataToUpdate,
    });

    return res.status(200).json(updatedActivity);
  } catch (error) {
    console.error(`Erro ao atualizar atividade física com ID ${id}:`, error.message);
    return res.status(500).json({
      erro: "Não foi possível atualizar a atividade física",
      detalhes: error.message,
    });
  }
};

//remove por id
const deletePhysicalActivity = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ erro: "ID inválido", detalhes: "O ID deve ser um número válido" });
  }

  try {
    await prisma.physical_activities.delete({ where: { id: numericId } });

    return res.status(200).json({ mensagem: `Atividade física com ID ${numericId} foi removida com sucesso.` });
  } catch (error) {
    console.error(`Erro ao apagar atividade física com ID ${id}:`, error.message);
    return res.status(500).json({
      erro: "Não foi possível apagar a atividade física",
      detalhes: error.message,
    });
  }
};


//Pesquisa as atividades de diversas maneiras
const searchPhysicalActivities = async (req, res) => {
  const { user_id, activity_type, minDuration, maxDuration, minCalories, maxCalories, date, startDate, endDate } = req.query;

  if (!user_id) {
    return res.status(400).json({ erro: "user_id é obrigatório", detalhes: "O parâmetro user_id deve ser fornecido" });
  }

  try {
    const filters = { user_id: parseInt(user_id, 10) };

    if (activity_type) {
      filters.activity_type = { contains: activity_type, mode: 'insensitive' };
    }

    if (minDuration) {
      filters.duration_minutes = { gte: parseInt(minDuration, 10) };
    }
    if (maxDuration) {
      filters.duration_minutes = { ...filters.duration_minutes, lte: parseInt(maxDuration, 10) };
    }

    if (minCalories) {
      filters.calories_burned = { gte: parseInt(minCalories, 10) };
    }
    if (maxCalories) {
      filters.calories_burned = { ...filters.calories_burned, lte: parseInt(maxCalories, 10) };
    }

    if (date) {
      filters.date = new Date(date); 
    } else if (startDate || endDate) {
      filters.date = {};
      if (startDate) filters.date.gte = new Date(startDate);
      if (endDate) filters.date.lte = new Date(endDate);
    }

    const activities = await prisma.physical_activities.findMany({ where: filters });

    if (activities.length === 0) {
      return res.status(404).json({ erro: "Nenhuma atividade física encontrada com os critérios fornecidos" });
    }

    return res.status(200).json(activities);
  } catch (error) {
    console.error("Erro ao buscar atividades físicas:", error.message);
    return res.status(500).json({
      erro: "Não foi possível buscar as atividades físicas",
      detalhes: error.message,
    });
  }
};

module.exports = {
  createPhysicalActivity,
  getAllPhysicalActivities,
  updatePhysicalActivity,
  deletePhysicalActivity,
  searchPhysicalActivities,
};
