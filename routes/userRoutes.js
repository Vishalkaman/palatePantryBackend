const express = require('express');
const { createUser, getAllUsers, loginUser, getUserById, getUserByUsername} = require('../controllers/userController');

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.post('/login', loginUser);
router.get('/id/:id', getUserById);
router.get('/username/:username', getUserByUsername);

module.exports = router;

