import { createContext, useContext, useState } from "react";
import axios from "axios";
import { NotificationContext } from "./NotificationContext";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const notificationContext = useContext(NotificationContext);
  const [userData, setUserData] = useState(null);

  // Save user data
  const setUserDataState = (data) => {
    if (data === null) return setUserData(null);

    // get object keys and check if id and username exist
    const keys = Object.keys(data);
    if (!keys.includes("id") || !keys.includes("username")) return;

    // Return if one or more keys are empty
    if (data.id === "" || data.username === "") return;

    setUserData(data);
  };

  const createUser = async (username, password) => {
    // Make a post request sending the username and password
    try {
      const response = await axios.post("http://localhost:3001/api/users", {
        username,
        password,
      });

      return true;
    } catch (error) {
      console.log(error);
      if (error.status === 500)
        notificationContext.notify({
          msg: error.response.statusText,
          type: "error",
        });
      notificationContext.notify({
        msg: error.response.data.message,
        type: "error",
      });
      return false;
    }
  };

  // This will be used to change the username or password
  const updateUserData = async ({ username = null, password = null } = {}) => {
    // return if both username or password are null
    if (!username && !password) return false;

    // Return early if new username is same as the current username.
    if (username && username === userData.username) return false;

    // Update the necesary fields
    try {
      const { data } = await axios.patch(
        `http://localhost:3001/api/users/${userData?.id}`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      // If success, we store the new data.
      if (data) {
        setUserData(data);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const values = { userData, updateUserData, setUserDataState, createUser };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
