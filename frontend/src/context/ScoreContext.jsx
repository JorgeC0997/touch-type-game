import { createContext, useContext, useEffect, useState } from "react";
import { AccountContext } from "./AccountContext";
import axios from "axios";

export const ScoreContext = createContext();

export const ScoreContextProvider = ({ children }) => {
  const accountContext = useContext(AccountContext);
  const [scoresByAccount, setScoresByAccount] = useState(null);
  const [highestScore, setHighestScore] = useState(0);

  // Get all scores attached to the current user account
  const getScoresByAccount = async (controller) => {
    if (!accountContext.accountData) return;
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/scores/byAccount/${accountContext.accountData.id}`,
        {
          withCredentials: true,
          signal: controller.signal,
        }
      );

      if (data) {
        setScoresByAccount(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Update score with new high score in db
  const checkNewScore = async (accountId, exerciseId, score, controller) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/scores/update_score`,
        {
          account_id: accountId,
          exercise_id: exerciseId,
          new_record: score,
        },
        {
          withCredentials: true,
          signal: controller.signal,
        }
      );

      if (response.status === 406) {
        console.log(response.data.message);
        return false;
      }

      // Retrieve the scores with the new data if new high score was successfully saved.
      getScoresByAccount(new AbortController());
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Set highest score among all user's scores
  const getHighestScore = async () => {
    if (!scoresByAccount) return;

    let highest = 0;
    scoresByAccount.forEach((score) => {
      if (score.wpm_record > highest) {
        highest = score.wpm_record;
      }
    });

    setHighestScore(highest);
  };

  // Retrieve scores by user's account every time accountData state changes
  useEffect(() => {
    const controller = new AbortController();
    getScoresByAccount(controller);

    return () => {
      controller.abort();
    };
  }, [accountContext.accountData]);

  // Re-run getHighestScore every time we get a new score
  useEffect(() => {
    getHighestScore();
  }, [scoresByAccount]);

  const values = {
    scoresByAccount,
    highestScore,
    getScoresByAccount,
    checkNewScore,
    getHighestScore,
  };

  return (
    <ScoreContext.Provider value={values}>{children}</ScoreContext.Provider>
  );
};
