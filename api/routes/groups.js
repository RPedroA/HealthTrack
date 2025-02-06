const express = require('express');
const router = express.Router();
const {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroups,
  searchGroups,
} = require('../controllers/groupsController');


router.post('/', createGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.get('/', getGroups);
router.get('/search', searchGroups);

module.exports = router;
