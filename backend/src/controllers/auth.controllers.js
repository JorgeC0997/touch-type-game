import { pool } from "../dbConnection.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import bcrypt from "bcrypt";

export const userAuth = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rowCount <= 0)
      return res.status(404).json({ message: "user not found" });

    const isPasswordValid = await bcrypt.compare(
      password,
      result.rows[0]?.hash
    );

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid password" });

    try {
      const maxAge = 1 * 60 * 60; //seconds
      const token = jwt.sign({ id: result.rows[0].id }, JWT_SECRET, {
        expiresIn: maxAge,
      });
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res
        .status(200)
        .json({ id: result.rows[0].id, username: result.rows[0].username });
    } catch (error) {
      res.status(401).send({ message: error.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
  res.sendStatus(200);
};

export const verifyUserAuth = (req, res) => {
  const token = req.cookies?.jwt;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(decoded);
      }
    });
  } else {
    res.status(400).json({ message: "No token found" });
  }
};
