const express = require('express');
const router = express.Router();
const {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroups,
  searchGroups,
} = require('../controllers/groupsController');

// Criar grupo
router.post('/', createGroup);

// Atualizar grupo
router.put('/:id', updateGroup);

// Eliminar grupo
router.delete('/:id', deleteGroup);

// Listar todos os grupos
router.get('/', getGroups);

// Pesquisar grupos
router.get('/search', searchGroups);

module.exports = router;
