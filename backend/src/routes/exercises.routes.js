import { Router } from "express";
import {
  getExercise,
  getExercisesById,
} from "../controllers/exercises.controllers.js";

const router = Router();

router.get("/:id", getExercise);
router.get("/getIds/:level", getExercisesById);

export default router;
