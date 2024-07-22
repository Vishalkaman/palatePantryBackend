const express = require('express');
const { createBudget, getBudgetsByUser, updateUserBudget} = require('../controllers/budgetController');

const router = express.Router();

router.post('/', createBudget);
router.get('/user/:userId', getBudgetsByUser);
router.put('/:userId', updateUserBudget);


module.exports = router;
