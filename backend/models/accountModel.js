import { pool } from "./dbConnection.js";

//get all accounts
const getAccounts = async () => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT * FROM accounts", (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
};

//Add a new account record in the database
const addAccount = (body) => {
  return new Promise(function (resolve, reject) {
    const { username, hash } = body;
    pool.query(
      "INSERT INTO accounts (username, hash) VALUES ($1, $2) RETURNING *",
      [username, hash],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(
            `A new user has been added: ${JSON.stringify(results.rows[0])}`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

export { getAccounts, addAccount };
