const express = require('express');
const { createBudget, getBudgetsByUser } = require('../controllers/budgetController');

const router = express.Router();

router.post('/', createBudget);
router.get('/user/:userId', getBudgetsByUser);

module.exports = router;
