import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { UserContext } from "./UserContext";

export const AccountContext = createContext();

export const AccountContextProvider = ({ children }) => {
  const [accountData, setAccountData] = useState(null);
  const userContext = useContext(UserContext);

  const getAccountData = async (userId, controller) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/accounts/${userId}`,
        {
          withCredentials: true,
          signal: controller.signal,
        }
      );
      if (data) {
        setAccountData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLevel = async (new_level, account_id) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/accounts/levelup`,
        {
          new_level,
          account_id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 401) {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  };

  const setSuperuser = async (account_id) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/accounts/superuser`,
        {
          value: true,
          account_id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 401) {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  };

  const levelUp = async (scoresByAccount) => {
    const levelExerciseCount = [10, 10, 8];
    let completedScoreByLevel = 0;

    if (scoresByAccount) {
      scoresByAccount.forEach((score) => {
        if (score.level === accountData.level) {
          completedScoreByLevel += 1;
        }
      });
    }

    if (accountData.level === 3) {
      if (
        completedScoreByLevel ===
        levelExerciseCount[accountData.level - 1] - 1
      ) {
        const superuserStatus = await setSuperuser(accountData.id);
        if (superuserStatus) {
          getAccountData(userContext.userData.id, new AbortController());
          return console.log("You're Super User now!");
        } else {
          return console.log("Couldn't update account superuser");
        }
      }
    }

    if (
      completedScoreByLevel ===
      levelExerciseCount[accountData.level - 1] - 1
    ) {
      const newLevel = accountData.level + 1;
      const levelUpStatus = await updateLevel(newLevel, accountData.id);
      if (levelUpStatus) {
        getAccountData(userContext.userData.id, new AbortController());
        console.log("You leveled up!");
      } else {
        console.log("Couldn't update account level");
      }
    }
    console.log(scoresByAccount);
  };

  useEffect(() => {
    const controller = new AbortController();
    if (userContext.userData) {
      getAccountData(userContext.userData.id, controller);
    }

    return () => {
      controller.abort();
    };
  }, [userContext.userData]);

  const values = {
    accountData,
    setAccountData,
    getAccountData,
    levelUp,
  };

  return (
    <AccountContext.Provider value={values}>{children}</AccountContext.Provider>
  );
};
