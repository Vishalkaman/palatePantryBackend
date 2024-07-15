const db = require('../config/database');

const createBudget = async (req, res) => {
    const { user_id, period, start_date, end_date, allocated_amount, spent_amount } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO Budget (user_id, period, start_date, end_date, allocated_amount, spent_amount) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, period, start_date, end_date, allocated_amount, spent_amount || 0]
        );
        res.status(201).json({ id: result.insertId, user_id, period, start_date, end_date, allocated_amount, spent_amount: spent_amount || 0 });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getBudgetsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const [budgets] = await db.execute('SELECT * FROM Budget WHERE user_id = ?', [userId]);
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createBudget,
    getBudgetsByUser
};
