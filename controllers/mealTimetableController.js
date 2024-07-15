const db = require('../config/database');

const createMealTimetable = async (req, res) => {
    const { user_id, meal_date, meal_time, recipe_id } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO MealTimetable (user_id, meal_date, meal_time, recipe_id) VALUES (?, ?, ?, ?)',
            [user_id, meal_date, meal_time, recipe_id]
        );
        res.status(201).json({ id: result.insertId, user_id, meal_date, meal_time, recipe_id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getMealTimetableByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const [mealTimetable] = await db.execute('SELECT * FROM MealTimetable WHERE user_id = ?', [userId]);
        res.status(200).json(mealTimetable);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createMealTimetable,
    getMealTimetableByUser
};

