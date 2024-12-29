import express from "express";
import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import exercisesRoutes from "./routes/exercises.routes.js";
import accountRoutes from "./routes/accounts.routes.js";
import scoresRoutes from "./routes/scores.routes.js";
import { DB, SERVER_PORT } from "./config.js";
import { requireAuth } from "./middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";

import { pool } from "./dbConnection.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") {
    res.status(200).end(); // Respond to preflight requests with a 200 status
    return;
  }

  next();
});
app.use("/api/users", usersRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exercises", requireAuth, exercisesRoutes);
app.use("/api/scores", requireAuth, scoresRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    message: "endpoint not found",
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`App running on port ${SERVER_PORT}`);
});
