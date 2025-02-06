const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Cria ou atualiza para um usuário em num determinado dia.

const createOrUpdateDailyHealthMetrics = async (req, res) => {
  const {
    user_id,
    date,
    calories_consumed,
    water_consumed_ml,
    steps_count,
    weight_kg,
    sleep_quality,
    sleep_hours,
  } = req.body;

  const missingParams = [];
  const invalidParams = [];

  // Validação dos parâmetros obrigatórios e tipo
  if (!user_id) missingParams.push("user_id");
  if (typeof user_id !== "number") invalidParams.push("user_id deve ser um número");

  if (!date) missingParams.push("date");
  if (isNaN(new Date(date))) invalidParams.push("date deve ser uma data válida");

  // Validação dos valores individuais
  const validatePositive = (value, fieldName) => {
    if (value !== undefined && value < 0) invalidParams.push(`${fieldName} não pode ser negativo`);
  };
  
  validatePositive(calories_consumed, "calories_consumed");
  validatePositive(water_consumed_ml, "water_consumed_ml");
  validatePositive(steps_count, "steps_count");
  validatePositive(weight_kg, "weight_kg");

  if (sleep_quality !== undefined && (sleep_quality < 0 || sleep_quality > 100)) {
    invalidParams.push("sleep_quality deve estar entre 0 e 100");
  }

  if (sleep_hours !== undefined && (sleep_hours < 0 || sleep_hours > 24)) {
    invalidParams.push("sleep_hours deve estar entre 0 e 24");
  }

  // Resposta de erro caso faltem parâmetros ou existam parâmetros inválidos
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
    // Verifica se já existe um registro para o mesmo user_id e date
    const existingMetrics = await prisma.daily_health_metrics.findFirst({
      where: {
        user_id: user_id,
        date: new Date(date),
      },
    });

    const dataToSave = {
      calories_consumed,
      water_consumed_ml,
      steps_count,
      weight_kg: weight_kg !== undefined ? String(weight_kg) : undefined,
      sleep_quality,
      sleep_hours,
    };

    // Atualiza os dados se já existir
    if (existingMetrics) {
      const updatedMetrics = await prisma.daily_health_metrics.update({
        where: { id: existingMetrics.id },
        data: dataToSave,
      });
      return res.status(200).json(updatedMetrics);
    }

    // Cria um novo registro se não existir
    const newMetrics = await prisma.daily_health_metrics.create({
      data: {
        user_id: user_id,  // Correção aqui, ao invés de user_id, usámos user_id
        date: new Date(date),
        ...dataToSave,
      },
    });

    return res.status(201).json(newMetrics);
  } catch (error) {
    console.error("Erro ao criar/atualizar DailyHealthMetrics:", error.message);

    if (error.code === "P2002") {
      return res.status(400).json({
        erro: "Já existe um DailyHealthMetrics para este usuário e esta data",
        detalhes: error.message,
      });
    }

    return res.status(500).json({
      erro: "Falha ao processar DailyHealthMetrics",
      detalhes: error.message,
    });
  }
};


//Obtém todos os registros

const getAllDailyHealthMetrics = async (req, res) => {
  try {
    const metrics = await prisma.daily_health_metrics.findMany();
    return res.status(200).json(metrics);
  } catch (error) {
    console.error("Erro ao buscar daily_health_metrics:", error.message);
    return res.status(500).json({
      erro: "Não foi possível buscar os registros",
      detalhes: error.message,
    });
  }
};

//Atualiza pelo ID.

const updateDailyHealthMetrics = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido",
    });
  }

  const {
    date,
    calories_consumed,
    water_consumed_ml,
    steps_count,
    weight_kg,
    sleep_quality,
    sleep_hours,
  } = req.body;

  const dataToUpdate = {};

  if (date !== undefined && !isNaN(new Date(date))) {
    dataToUpdate.date = new Date(date);
  }
  if (calories_consumed !== undefined && calories_consumed >= 0) {
    dataToUpdate.calories_consumed = calories_consumed;
  }
  if (water_consumed_ml !== undefined && water_consumed_ml >= 0) {
    dataToUpdate.water_consumed_ml = water_consumed_ml;
  }
  if (steps_count !== undefined && steps_count >= 0) {
    dataToUpdate.steps_count = steps_count;
  }
  if (weight_kg !== undefined && weight_kg >= 0) {
    dataToUpdate.weight_kg = String(weight_kg);
  }
  if (sleep_quality !== undefined && sleep_quality >= 0 && sleep_quality <= 100) {
    dataToUpdate.sleep_quality = sleep_quality;
  }
  if (sleep_hours !== undefined && sleep_hours >= 0 && sleep_hours <= 24) {
    dataToUpdate.sleep_hours = sleep_hours;
  }

  try {
    const updatedMetrics = await prisma.daily_health_metrics.update({
      where: { id: numericId },
      data: dataToUpdate,
    });

    return res.status(200).json(updatedMetrics);
  } catch (error) {
    console.error(
      `Erro ao atualizar daily_health_metrics com ID ${id}:`,
      error.message
    );
    return res.status(500).json({
      erro: "Não foi possível atualizar o registro",
      detalhes: error.message,
    });
  }
};

//Remove pelo ID.

const deleteDailyHealthMetrics = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({
      erro: "ID inválido",
      detalhes: "O ID deve ser um número válido",
    });
  }

  try {
    await prisma.daily_health_metrics.delete({ where: { id: numericId } });

    return res.status(200).json({
      mensagem: `daily_health_metrics com ID ${numericId} foi removido com sucesso.`,
    });
  } catch (error) {
    console.error(
      `Erro ao apagar daily_health_metrics com ID ${id}:`,
      error.message
    );
    return res.status(500).json({
      erro: "Não foi possível apagar o registro",
      detalhes: error.message,
    });
  }
};

//Pesquisa registroscom base em diferentes parâmetros

const searchDailyHealthMetrics = async (req, res) => {
  const {
    user_id,
    calories_consumed,
    water_consumed_ml,
    steps_count,
    weight_kg,
    sleep_quality,
    sleep_hours,
    date,
    startDate,
    endDate,
  } = req.query;

  const parsedStartDate = startDate ? new Date(startDate) : null;
  const parsedEndDate = endDate ? new Date(endDate) : null;
  const parsedDate = date ? new Date(date) : null;

  const searchCriteria = {};

  if (user_id) {
    searchCriteria.user_id = parseInt(user_id, 10);
  }
  if (calories_consumed) {
    searchCriteria.calories_consumed = parseInt(calories_consumed, 10);
  }
  if (water_consumed_ml) {
    searchCriteria.water_consumed_ml = parseInt(water_consumed_ml, 10);
  }
  if (steps_count) {
    searchCriteria.steps_count = parseInt(steps_count, 10);
  }
  if (weight_kg) {
    searchCriteria.weight_kg = new Decimal(weight_kg);
  }
  if (sleep_quality) {
    searchCriteria.sleep_quality = parseInt(sleep_quality, 10);
  }
  if (sleep_hours) {
    searchCriteria.sleep_hours = parseInt(sleep_hours, 10);
  }

  // Se a data específica for fornecida, ela terá prioridade sobre o intervalo
  if (parsedDate) {
    searchCriteria.date = parsedDate;
  }

  // Se o intervalo de datas for fornecido, usará o intervalo
  if (parsedStartDate && parsedEndDate) {
    searchCriteria.date = {
      gte: parsedStartDate,
      lte: parsedEndDate,
    };
  }

  try {
    const results = await prisma.daily_health_metrics.findMany({
      where: searchCriteria,
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error(
      "Erro ao realizar a pesquisa de daily_health_metrics:",
      error.message
    );
    return res.status(500).json({
      erro: "Não foi possível realizar a pesquisa",
      detalhes: error.message,
    });
  }
};


module.exports = {
  createOrUpdateDailyHealthMetrics,
  getAllDailyHealthMetrics,
  updateDailyHealthMetrics,
  deleteDailyHealthMetrics,
  searchDailyHealthMetrics,
};
