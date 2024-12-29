import { Router } from "express";
import {
  getScoresByAccountId,
  getScoreByExerciseId,
  updateScore,
} from "../controllers/scores.controllers.js";

const router = Router();

router.get("/byAccount/:account_id", getScoresByAccountId);

router.get(
  "/byAccount/:account_id/exercise/:exercise_id",
  getScoreByExerciseId
);

router.patch("/update_score", updateScore);

export default router;
