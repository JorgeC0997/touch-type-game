import { pool } from "../dbConnection.js";

export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.status(200).send(rows);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rowCount <= 0)
      return res.status(404).json({ message: "user not found" });
    res.status(200).send(result.rows[0]);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { username, hash } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (username, hash) VALUES ($1, $2) RETURNING *",
      [username, hash]
    );
    res.status(200).send(rows[0]);
  } catch (error) {
    res.status(500).send({ message: error.message });
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
  const { username, hash } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET username = COALESCE($1, username), hash = COALESCE($2, hash) WHERE id = $3 RETURNING *",
      [username, hash, id]
    );
    if (result.rowCount <= 0)
      return res.status(404).json({ message: "user not found" });
    res.status(200).send(result.rows[0]);
  } catch (error) {}
};
