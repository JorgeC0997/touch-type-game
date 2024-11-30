import { config } from "dotenv";
config();
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = { pool };
