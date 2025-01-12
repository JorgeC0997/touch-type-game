import { pool } from "../dbConnection.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config.js";
import crypto from "crypto";

export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, username FROM users");
    res.status(200).send(rows);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1",
      [id]
    );
    if (result.rowCount <= 0)
      return res.status(404).json({ message: "user not found" });
    res.status(200).send(result.rows[0]);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { username, password } = req.body;
  const uuid = crypto.randomUUID();
  try {
    const hash = await bcrypt.hash(password, parseInt(SALT_ROUNDS));
    try {
      const userResponse = await pool.query(
        "INSERT INTO users (id, username, hash) VALUES ($1, $2, $3) RETURNING id, username",
        [uuid, username, hash]
      );
      const accountResponse = await pool.query(
        "INSERT INTO accounts (user_id, level) VALUES ($1, $2) RETURNING id",
        [uuid, 1]
      );
      if (!accountResponse.rows[0].id)
        return res
          .status(400)
          .json({ message: "Error occurred while creating user account" });
      res.status(200).json({
        user: userResponse.rows[0],
        accountId: accountResponse.rows[0].id,
      });
    } catch (error) {
      if (error.message.includes("duplicate"))
        return res
          .status(400)
          .json({ message: "User name already registered" });
      res.status(500).send({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    if (result.rowCount <= 0)
      return res.status(404).json({ message: "user not found" });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  if (!id) return res.status(401).json({ message: "Insufficient parameters" });

  try {
    let hash;
    if (password) {
      hash = await bcrypt.hash(password, parseInt(SALT_ROUNDS));
    }

    try {
      const result = await pool.query(
        "UPDATE users SET username = COALESCE($1, username), hash = COALESCE($2, hash) WHERE id = $3 RETURNING *",
        [username, hash, id]
      );
      if (result.rowCount <= 0)
        return res.status(404).json({ message: "Could not update user" });
      res.status(200).send(result.rows[0]);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
