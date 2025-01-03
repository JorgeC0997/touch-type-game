import { config } from "dotenv";

config();

export const USER = process.env.USER || "postgres";
export const HOST = process.env.HOST || "localhost";
export const DB = process.env.DB || "postgres";
export const PASSWORD = process.env.PASSWORD || "&9zS1#YXb5NYp";
export const DB_PORT = process.env.DB_PORT || 5432;
export const SERVER_PORT = process.env.SERVER_PORT || 3001;
export const JWT_SECRET =
  process.env.JWT_SECRET || "782h463b53dd64088k34171afr784052";
export const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
