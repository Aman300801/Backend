const express = require("express");
const router = express.Router();

const { client } = require("../database");

const posts = [
  { id: 1, title: "post one" },
  { id: 2, title: "post Two" },
  { id: 3, title: "post Three" },
  { id: 4, title: "post Four" },
];

router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit) || 0;
  client.query("SELECT * FROM users", (err, dbResult) => {
    if (err) {
      console.error("Error executing query", err.stack);
      return res.status(500).json({ error: "Database error" });
    }

    // console.log("Query results:", dbResult.rows);

    const posts = dbResult.rows;
    if (!isNaN(limit) && limit > 0) {
      const result = posts.slice(0, limit);
      res.json(result);
    } else {
      res.json(posts);
    }
  });
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.status(404).json({ message: `Post with id: ${id} not found.` });
  } else {
    res.status(200).json({ post: post });
  }
});

router.post("/create", (req, res) => {
  const { title } = req.body;
  console.log(req.body);
  if (!title || title.trim() === "") {
    return next(new Error("Title is required."));
  }

  posts.push({
    id: posts.length + 1,
    title: title,
  });
  res.status(201).json({ message: "Post created successfully." });
});

// Update a post
router.put("/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  const { title } = req.body;
  const postIndex = posts.findIndex((post) => post.id === id);

  if (!title || title.trim() === "") {
    return next((new Error("Title is required.").status = 400));
  }

  posts[postIndex].title = title;
  res.status(200).json({ message: "Post updated successfully." });
});

// Deleting a post
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ message: `Post with id: ${id} not found.` });
  }
  posts.splice(postIndex, 1);
  res.status(200).json({ message: "Post deleted successfully." });
});

module.exports = router;
