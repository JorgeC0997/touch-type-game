import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { NotificationContext } from "./NotificationContext";

export const AccountContext = createContext();

export const AccountContextProvider = ({ children }) => {
  const notificationContext = useContext(NotificationContext);
  const [accountData, setAccountData] = useState(null);
  const userContext = useContext(UserContext);

  // Fetch account data by user id
  const getAccountData = async (userId, controller) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/accounts/${userId}`,
        {
          withCredentials: true,
          signal: controller.signal,
        }
      );

      // save data if successful
      if (data) {
        setAccountData(data);
      }
    } catch (error) {
      console.log(error);
      // TODO: we should render a message box with red background indicating "could not retrieve account data"
    }
  };

  // Update account level
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

      // FIXME: we might not need this because will bi catched down below
      // return early if we have a bad satus code
      if (response.status === 401) {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  };

  // Set superuser boolean state in db
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

      // FIXME: this can get catch down below
      if (response.status === 401) {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  };

  // We get all scores by account as a parameter
  const levelUp = async (scoresByAccount) => {
    // Declare total count of exercises by level.
    const levelExerciseCount = [10, 10, 8];

    let completedScoreByLevel = 0;

    if (scoresByAccount) {
      // count number of exercises that user have completed that are
      // in the same level that user's account
      scoresByAccount.forEach((score) => {
        if (score.level === accountData.level) {
          completedScoreByLevel += 1;
        }
      });
    }

    if (accountData.level === 3) {
      // Set user user status to true and update Account Context
      // if the total amount of completed exercises are equal to
      // the count of exercises in database
      if (
        completedScoreByLevel ===
        levelExerciseCount[accountData.level - 1] - 1
      ) {
        const superuserStatus = await setSuperuser(accountData.id);
        if (superuserStatus) {
          getAccountData(userContext.userData.id, new AbortController());
          // Show message in navbar
          notificationContext.notify({
            msg: "You're Super User now!",
            delay: 5000,
          });
          return console.log("You're Super User now!");
        } else {
          return console.log("Couldn't update account superuser");
        }
      }
    }

    // if current account's level isn't 3, we simply upgrade to next level
    if (
      completedScoreByLevel ===
      levelExerciseCount[accountData.level - 1] - 1
    ) {
      const newLevel = accountData.level + 1;
      const levelUpStatus = await updateLevel(newLevel, accountData.id);
      if (levelUpStatus) {
        getAccountData(userContext.userData.id, new AbortController());
      } else {
        console.log("Couldn't update account level");
        // TODO: throw error in navbar
      }
    }
  };

  // Get account's data every time userData changes
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
