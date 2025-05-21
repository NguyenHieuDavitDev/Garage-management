const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Update with your MySQL password
  database: "dashboard_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return; // Exit if connection fails
  }
  console.log("Connected to MySQL database.");
});

module.exports = connection;
