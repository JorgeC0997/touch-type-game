import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  getAccount,
  levelUp,
  setSuperuser,
} from "../controllers/accounts.controllers.js";

const router = Router();

router.get("/:user_id", requireAuth, getAccount);
router.patch("/levelup", requireAuth, levelUp);
router.patch("/superuser", requireAuth, setSuperuser);

export default router;
