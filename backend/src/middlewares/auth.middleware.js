import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json(err);
      } else {
        next();
      }
    });
  } else {
    res.status(400).json({ message: "No token found" });
  }
};
