import { pool } from "../dbConnection.js";

export const getExercise = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(401).json({ message: "No exercise id provided" });
  try {
    const result = await pool.query("SELECT * FROM exercises WHERE id = $1", [
      id,
    ]);

    if (result.rowCount <= 0)
      return res.status(404).json({ message: "Exercise not found" });
    res.status(200).send(result.rows[0]);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

export const getExercisesById = async (req, res) => {
  const { level } = req.params;

  if (!level) return res.status(401).json({ message: "No level provided" });
  let exercises = [];
  for (let i = 0; i < level; i++) {
    try {
      const result = await pool.query(
        "SELECT id, level, exercise_number FROM exercises WHERE level = $1 ORDER BY level, exercise_number",
        [i + 1]
      );

      if (result.rowCount <= 0) {
        return res.status(401).json({ message: "No results retrieved" });
      }

      exercises = [...exercises, ...result.rows];
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  res.status(200).send(exercises);
};
