import pg from "pg";
import { USER, HOST, DB, DB_PORT, PASSWORD } from "./config.js";
const { Pool } = pg;

export const pool = new Pool({
  user: USER,
  host: HOST,
  database: DB,
  password: PASSWORD,
  port: DB_PORT,
});
