const { Client } = require("pg");

const dbConfig = {
  user: "aman",
  host: "localhost",
  database: "Instagram",
  port: 5432,
  password: "Conditionzero",
};

const client = new Client(dbConfig);

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  client,
};
// This file handles the database connection using pg module
