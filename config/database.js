const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'recipe-db.ctwg4cywy20f.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'palate20KSIT24',
    database: 'recipes',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
