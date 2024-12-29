import { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const setUserDataState = (data) => {
    if (data === null) return setUserData(null);

    const keys = Object.keys(data);
    if (!keys.includes("id") || !keys.includes("username")) return;
    if (data.id === "" || data.username === "") return;

    setUserData(data);
  };

  const updateUserData = async ({ username = null, password = null } = {}) => {
    if (!username && !password) return false;

    if (username && username === userData.username) return false;
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

      if (data) {
        setUserData(data);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const values = { userData, updateUserData, setUserDataState };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
