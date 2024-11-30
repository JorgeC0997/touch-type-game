import { config } from "dotenv";
config();
import express from "express";

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
