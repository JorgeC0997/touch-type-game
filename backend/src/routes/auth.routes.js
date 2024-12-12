import { Router } from "express";
import {
  userAuth,
  verifyUserAuth,
  logoutUser,
} from "../controllers/auth.controllers.js";

const router = Router();

router.post("/login", userAuth);
router.get("/logout", logoutUser);
router.get("/verify", verifyUserAuth);

export default router;
