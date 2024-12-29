import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/users.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getUsers);

router.get("/:id", requireAuth, getUser);

router.post("/", createUser);

router.delete("/:id", requireAuth, deleteUser);

router.patch("/:id", requireAuth, updateUser);

export default router;
