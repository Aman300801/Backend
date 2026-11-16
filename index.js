// require("dotenv").config();
const express = require("express");
// const database = require("./database");
const { createServer } = require("http");
const { Server } = require("socket.io");
const redis = require("redis");
const process = require("process");

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on("error", (err) => console.error("Redis error:", err.message));

redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err) => console.error("Could not connect to Redis:", err.message));

const app = express();
const port = process.env.PORT || 8000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.broadcast.emit("Welcome user to the server", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.emit("message", data);
  });
});

const logger = require("./middleware/logger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

// Connect to the database
// const { connectDB } = database;
// connectDB();

//Routes
// const postsRouter = require("./routes/posts");

//Middleware
app.use((req, res, next) => {
  if (req.url.includes("/posts")) {
    console.log("Posts route skipped logging");
    return next();
  }
  logger(req, res, next);
}); // Logging middleware

// Request body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  try {
    const visits = await redisClient.incr("visits");
    res.send("No of visits is: " + visits);
  } catch (err) {
    console.error("Error talking to Redis:", err.message);
    res.status(500).send("Error talking to Redis");
  }
});

// app.use(notFound);
app.use(errorHandler); // Error handling middleware (must be last)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
