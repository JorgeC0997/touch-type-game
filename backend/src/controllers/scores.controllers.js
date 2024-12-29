import { pool } from "../dbConnection.js";

export const getScoreByExerciseId = async (req, res) => {
  const { account_id, exercise_id } = req.params;

  if (!account_id)
    return res.status(401).json({ message: "No account id provided" });

  if (!exercise_id)
    return res.status(401).json({ message: "No exercise id provided" });

  try {
    const result = await pool.query(
      "SELECT wpm_record FROM scores WHERE account_id = $1 AND exercise_id = $2",
      [account_id, exercise_id]
    );

    if (result.rowCount <= 0)
      return res.status(401).json({ message: "No results retrieved" });

    res.status(200).send(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getScoresByAccountId = async (req, res) => {
  const { account_id } = req.params;

  if (!account_id)
    return res.status(401).json({ message: "No account id provided" });

  try {
    const result = await pool.query(
      "SELECT scores.id, exercise_id, exercises.level, exercises.exercise_number, wpm_record FROM scores JOIN exercises ON scores.exercise_id = exercises.id WHERE account_id = $1 ORDER BY exercises.level, exercises.exercise_number",
      [account_id]
    );

    if (result.rowCount <= 0)
      return res.status(204).json({ message: "No results retrieved" });

    res.status(200).send(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const updateScore = async (req, res) => {
  const { account_id, exercise_id, new_record } = req.body;

  if (!account_id || !exercise_id || !new_record) {
    return res
      .status(400)
      .json({ message: "Invalid and/or insufficient data" });
  }

  try {
    const scoreResult = await pool.query(
      "SELECT wpm_record FROM scores WHERE account_id = $1 AND exercise_id = $2",
      [account_id, exercise_id]
    );

    if (scoreResult.rowCount <= 0) {
      try {
        const createResult = await pool.query(
          "INSERT INTO scores (account_id, exercise_id, wpm_record) VALUES($1, $2, $3) RETURNING id",
          [account_id, exercise_id, new_record]
        );

        if (createResult.rowCount <= 0)
          return res.status(500).json({ message: "Failed to save new record" });

        return res.sendStatus(201);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    }

    if (new_record > scoreResult.rows[0].wpm_record) {
      try {
        const updateResult = await pool.query(
          "UPDATE scores SET wpm_record = $1 WHERE account_id = $2 AND exercise_id = $3",
          [new_record, account_id, exercise_id]
        );

        if (updateResult.rowCount <= 0)
          return res.status(401).json({ message: "Failed to update score" });

        return res.sendStatus(200);
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
    res.status(406).json({ message: "Score is lower than current record" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
