const express = require('express');
const { createMealTimetable, getMealTimetableByUser } = require('../controllers/mealTimetableController');

const router = express.Router();

router.post('/', createMealTimetable);
router.get('/user/:userId', getMealTimetableByUser);

module.exports = router;

