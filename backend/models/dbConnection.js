import { config } from "dotenv";
config();
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});
