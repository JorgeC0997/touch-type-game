import express from "express";
import usersRoutes from "./routes/users.routes.js";
import { SERVER_PORT } from "./config.js";

const app = express();

app.use(express.json());
app.use(usersRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    message: "endpoint not found",
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`App running on port ${SERVER_PORT}`);
});
