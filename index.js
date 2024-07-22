// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Import routes
const userRoutes = require('./routes/userRoutes');
const familyMemberRoutes = require('./routes/familyMemberRoutes');
const mealTimetableRoutes = require('./routes/mealTimetableRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/family-members', familyMemberRoutes);
app.use('/api/meal-timetable', mealTimetableRoutes);
app.use('/api/budget', budgetRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
