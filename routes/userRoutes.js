const express = require('express');
const { createUser, getAllUsers, loginUser } = require('../controllers/userController');

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.post('/login', loginUser);

module.exports = router;

