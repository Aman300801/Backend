require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/hello", (req, res) => {
  res.send("hello aman");
});

app.get("/login", (req, res) => {
    res.send("<h1>Please login before accessing this route</h1>");
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
