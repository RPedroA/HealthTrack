const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//cria
const createPost = async (req, res) => {
  const { user_id, group_id, title, content, category } = req.body;

  if (!user_id || !group_id || !title || !content) {
    return res.status(400).json({
      erro: "Parâmetros obrigatórios ausentes",
      detalhes: ["user_id", "group_id", "title", "content"].filter((param) => !req.body[param]),
    });
  }

  try {
    const newPost = await prisma.posts.create({
      data: {
        user_id,
        group_id,
        title,
        content,
        category,
      },
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Erro ao criar post:", error.message);
    return res.status(500).json({
      erro: "Falha ao criar post",
      detalhes: error.message,
    });
  }
};

//obtem todos
const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        user: { select: { id: true, username: true } },
        group: { select: { id: true, name: true } },
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Erro ao buscar posts:", error.message);
    return res.status(500).json({
      erro: "Não foi possível buscar os posts",
      detalhes: error.message,
    });
  }
};

//obtem com paginação
const listPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 15;
  const skip = (page - 1) * pageSize;

  try {
    const posts = await prisma.posts.findMany({
      skip,
      take: pageSize,
      include: {
        user: { select: { id: true, username: true } },
        group: { select: { id: true, name: true } },
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Erro ao listar posts:", error.message);
    return res.status(500).json({
      erro: "Não foi possível listar os posts",
      detalhes: error.message,
    });
  }
};


//Atualiza
const updatePost = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ erro: "ID inválido", detalhes: "O ID deve ser um número válido" });
  }

  const { title, content, category } = req.body;

  try {
    const updatedPost = await prisma.posts.update({
      where: { id: numericId },
      data: { title, content, category },
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error(`Erro ao atualizar post com ID ${id}:`, error.message);
    return res.status(500).json({
      erro: "Não foi possível atualizar o post",
      detalhes: error.message,
    });
  }
};

//remove
const deletePost = async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ erro: "ID inválido", detalhes: "O ID deve ser um número válido" });
  }

  try {
    await prisma.posts.delete({ where: { id: numericId } });

    return res.status(200).json({ mensagem: `Post com ID ${numericId} foi removido com sucesso.` });
  } catch (error) {
    console.error(`Erro ao apagar post com ID ${id}:`, error.message);
    return res.status(500).json({
      erro: "Não foi possível apagar o post",
      detalhes: error.message,
    });
  }
};

//Pesquisa
const searchPosts = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ erro: "O parâmetro 'query' é obrigatório para a pesquisa." });
  }

  try {
    const posts = await prisma.posts.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Erro ao pesquisar posts:", error.message);
    return res.status(500).json({
      erro: "Não foi possível realizar a pesquisa",
      detalhes: error.message,
    });
  }
};

//Atualiza likes
const updateLikes = async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; 
  
    if (action !== "increase" && action !== "decrease") {
      return res.status(400).json({ erro: "Ação inválida", detalhes: "Use 'increase' ou 'decrease'" });
    }
  
    try {
      const updatedPost = await prisma.posts.update({
        where: { id: parseInt(id, 10) },
        data: {
          likes_count: action === "increase" ? { increment: 1 } : { decrement: 1 }, 
        },
      });
  
      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error(`Erro ao atualizar likes do post ${id}:`, error.message);
      return res.status(500).json({
        erro: "Não foi possível atualizar os likes",
        detalhes: error.message,
      });
    }
  };

const searchPostsByDate = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ erro: "O parâmetro 'date' é obrigatório para a pesquisa por data." });
  }

  try {
    const posts = await prisma.posts.findMany({
      where: {
        created_at: {
          equals: new Date(date),
        },
      },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Erro ao pesquisar posts por data:", error.message);
    return res.status(500).json({
      erro: "Não foi possível realizar a pesquisa por data",
      detalhes: error.message,
    });
  }
};

//Pesquisa por intervalo de datas
const searchPostsByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ erro: "Os parâmetros 'startDate' e 'endDate' são obrigatórios para a pesquisa por intervalo de datas." });
  }

  try {
    const posts = await prisma.posts.findMany({
      where: {
        created_at: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Erro ao pesquisar posts por intervalo de datas:", error.message);
    return res.status(500).json({
      erro: "Não foi possível realizar a pesquisa por intervalo de datas",
      detalhes: error.message,
    });
  }
};


module.exports = {
  createPost,
  getAllPosts,
  listPosts,
  updatePost,
  deletePost,
  searchPosts,
  updateLikes,
  searchPostsByDate, 
  searchPostsByDateRange, 
};
