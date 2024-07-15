const express = require('express');
const { createMealTimetable, getMealTimetableByUser, getMealTimetableByFamilyMember } = require('../controllers/mealTimetableController');

const router = express.Router();

router.post('/', createMealTimetable);
router.get('/user/:userId', getMealTimetableByUser);
router.get('/family-member/:familyMemberId', getMealTimetableByFamilyMember);

module.exports = router;
