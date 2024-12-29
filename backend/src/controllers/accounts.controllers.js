import { pool } from "../dbConnection.js";

export const getAccount = async (req, res) => {
  const { user_id } = req.params;
  try {
    if (!user_id)
      return res.status(401).json({ message: "No user id provided" });

    const result = await pool.query(
      "SELECT id, level, is_super_user FROM accounts WHERE user_id = $1",
      [user_id]
    );

    if (result.rowCount <= 0)
      return res.status(404).json({ message: "Account not found" });
    res.status(200).send(result.rows[0]);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

export const levelUp = async (req, res) => {
  const { new_level, account_id } = req.body;

  if (!account_id || !new_level)
    return res.status(401).json({ message: "Insufficient parameters" });

  try {
    const result = await pool.query(
      "UPDATE accounts SET level = $1 WHERE id = $2",
      [new_level, account_id]
    );

    if (result.rowCount <= 0)
      return res.status(401).json({ message: "Failed to update level" });

    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const setSuperuser = async (req, res) => {
  const { value, account_id } = req.body;

  if (!account_id || !value)
    return res.status(401).json({ message: "Insufficient parameters" });

  try {
    const result = await pool.query(
      value
        ? "UPDATE accounts SET is_super_user = TRUE WHERE id = $1"
        : "UPDATE accounts SET is_super_user = FALSE WHERE id = $1",
      [account_id]
    );

    if (result.rowCount <= 0)
      return res.status(401).json({ message: "Failed to update superuser" });

    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
