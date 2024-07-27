const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { username, password, email, contactNumber } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO Users (username, passwd, email, contactNumber) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, contactNumber],
    );
    res
      .status(201)
      .json({ id: result.insertId, username, email, contactNumber });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute("SELECT * FROM Users");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const [user] = await db.execute("SELECT * FROM Users WHERE id = ?", [
      userId,
    ]);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByUsername = async (req, res) => {
  const username = req.params.username;
  try {
    const [rows] = await db.execute(
      "SELECT username, email, contactNumber FROM Users WHERE username = ?",
      [username],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = rows[0];
    res.status(200).json({
      username: user.username,
      email: user.email,
      contactNumber: user.contactNumber,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Log incoming request
    console.log("Login request received for username:", username);

    // Fetch user details
    const [users] = await db.execute("SELECT * FROM Users WHERE username = ?", [username]);

    if (users.length > 0) {
      const user = users[0];

      // Check if password and passwd are present
      if (password && user.passwd) {
        console.log("User found, comparing passwords...");

        const match = await bcrypt.compare(password, user.passwd);

        if (match) {
          console.log("Passwords match, generating token...");

          const token = jwt.sign({ id: user.id }, "your_jwt_secret");

          // Fetch the user's current budget
          const [budget] = await db.execute(
            "SELECT * FROM Budget WHERE user_id = ? AND NOW() BETWEEN start_date AND end_date",
            [user.id]
          );

          let currentBudget = null;
          if (budget.length > 0) {
            const userBudget = budget[0];
            currentBudget = {
              period: userBudget.period,
              startDate: userBudget.start_date,
              endDate: userBudget.end_date,
              allocatedAmount: userBudget.allocated_amount,
              spentAmount: userBudget.spent_amount,
            };
          }

          // Fetch allergens from all family members
          const [familyMembers] = await db.execute("SELECT allergens FROM FamilyMembers WHERE user_id = ?", [user.id]);

          const allergensList = familyMembers.reduce((acc, member) => {
            try {
              const allergens = JSON.parse(member.allergens);
              Object.keys(allergens).forEach((allergen) => {
                if (allergens[allergen]) {
                  acc.add(allergen);
                }
              });
            } catch (e) {
              console.error(`Error parsing allergens for family member ${member.id}:`, e.message);
            }
            return acc;
          }, new Set());

          // Log success and return response
          console.log("Login successful for user:", user.username);

          res.json({
            token,
            userid: user.id,
            username: user.username,
            email: user.email,
            contactNumber: user.conactNumber, // note the correct field name
            currentBudget,
            allergens: Array.from(allergensList),
          });
        } else {
          console.error("Password mismatch for user:", user.username);
          res.status(400).json({ error: "Invalid credentials" });
        }
      } else {
        console.error("Password or password hash is missing for user:", user.username);
        res.status(400).json({ error: "Invalid credentials" });
      }
    } else {
      console.error("User not found for username:", username);
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Express route handler to get user details
const getUserDetails = async (req, res) => {
  const { user_id } = req.body;
  
  try {
    // Fetch user details
    const [users] = await db.execute("SELECT * FROM Users WHERE id = ?", [user_id]);

    if (users.length > 0) {
      const user = users[0];

      // Fetch the user's current budget
      const [budget] = await db.execute(
        "SELECT * FROM Budget WHERE user_id = ? AND NOW() BETWEEN start_date AND end_date",
        [user.id]
      );

      let currentBudget = null;
      if (budget.length > 0) {
        const userBudget = budget[0];
        currentBudget = {
          period: userBudget.period,
          startDate: userBudget.start_date,
          endDate: userBudget.end_date,
          allocatedAmount: userBudget.allocated_amount,
          spentAmount: userBudget.spent_amount,
        };
      }

      // Fetch allergens from all family members
      const [familyMembers] = await db.execute("SELECT allergens FROM FamilyMembers WHERE user_id = ?", [user.id]);

      const allergensList = familyMembers.reduce((acc, member) => {
        try {
          const allergens = JSON.parse(member.allergens);
          Object.keys(allergens).forEach((allergen) => {
            if (allergens[allergen]) {
              acc.add(allergen);
            }
          });
        } catch (e) {
          console.error(`Error parsing allergens for family member ${member.id}:`, e.message);
        }
        return acc;
      }, new Set());

      // Return user details
      res.json({
        userid: user.id,
        username: user.username,
        email: user.email,
        contactNumber: user.conactNumber, // note the correct field name
        currentBudget,
        allergens: Array.from(allergensList),
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};







module.exports = {
  createUser,
  getAllUsers,
  loginUser,
  getUserById,
  getUserDetails,
  getUserByUsername,
};
