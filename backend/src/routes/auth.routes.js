import { Router } from "express";
import {
  userAuth,
  verifyUserAuth,
  logoutUser,
} from "../controllers/auth.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", userAuth);
router.get("/logout", requireAuth, logoutUser);
router.get("/verify", requireAuth, verifyUserAuth);

export default router;
