const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Criar um grupo
async function createGroup(req, res) {
  const { name, description, image_path, created_by } = req.body;

  if (!name || !created_by) {
    return res.status(400).json({ error: 'Nome e criado por são obrigatórios.' });
  }

  try {
    const userExists = await prisma.users.findUnique({
      where: { id: created_by },
    });

    if (!userExists) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }
    const newGroup = await prisma.groups.create({
      data: {
        name,
        description,
        image_path,
        created_by,
      },
    });

    return res.status(201).json(newGroup);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar grupo.' });
  }
}

// Atualizar
async function updateGroup(req, res) {
  const { id } = req.params;
  const { name, description, image_path } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome do grupo é obrigatório.' });
  }

  try {
    const groupExists = await prisma.groups.findUnique({
      where: { id: parseInt(id) },
    });

    if (!groupExists) {
      return res.status(404).json({ error: 'Grupo não encontrado.' });
    }

    const updatedGroup = await prisma.groups.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        image_path,
      },
    });

    return res.status(200).json(updatedGroup);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar grupo.' });
  }
}

// Eliminar
async function deleteGroup(req, res) {
  const { id } = req.params;

  try {
    const groupExists = await prisma.groups.findUnique({
      where: { id: parseInt(id) },
    });

    if (!groupExists) {
      return res.status(404).json({ error: 'Grupo não encontrado.' });
    }

    await prisma.groups.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: 'Grupo eliminado com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao eliminar grupo.' });
  }
}

//Amostrar todos os grupos
async function getGroups(req, res) {
  try {
    const groups = await prisma.groups.findMany({
      include: {
        creator: true,
        posts: true,   
      },
    });

    return res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao obter grupos.' });
  }
}

// Pesquisar atraves de varios parametros
async function searchGroups(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'É necessário fornecer um parâmetro de pesquisa.' });
  }

  try {
    const groups = await prisma.groups.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        creator: true,
        posts: true,
      },
    });

    if (groups.length === 0) {
      return res.status(404).json({ message: 'Nenhum grupo encontrado com esse critério de pesquisa.' });
    }

    return res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao realizar a pesquisa.' });
  }
}

module.exports = {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroups,
  searchGroups,
};
