const client = require("./database");

client.query("SELECT * FROM users", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    console.log("Query results:", res.rows);
  }
  client.end();
});
