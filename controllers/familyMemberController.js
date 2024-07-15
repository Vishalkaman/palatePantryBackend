const db = require('../config/database');

const createFamilyMember = async (req, res) => {
    const { user_id, name, age, food_preferences, allergens } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO FamilyMembers (user_id, name, age, food_preferences, allergens) VALUES (?, ?, ?, ?, ?)',
            [user_id, name, age, JSON.stringify(food_preferences), JSON.stringify(allergens)]
        );
        res.status(201).json({ id: result.insertId, user_id, name, age, food_preferences, allergens });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getFamilyMembersByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const [familyMembers] = await db.execute('SELECT * FROM FamilyMembers WHERE user_id = ?', [userId]);
        res.status(200).json(familyMembers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createFamilyMember,
    getFamilyMembersByUser
};
