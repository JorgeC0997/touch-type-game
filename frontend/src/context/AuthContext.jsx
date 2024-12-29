import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { UserContext } from "./UserContext";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const userContext = useContext(UserContext);
  // const [userData, setUserData] = useState(null);
  const [isUserAuth, setIsUserAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loginUser = async (username, password) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      if (data) {
        // setUserData(data);
        userContext.setUserDataState(data);
        setIsUserAuth(true);
        navigate("/");
        return true;
      } else {
        // setUserData(null);
        userContext.setUserDataState(null);
        setIsUserAuth(false);
        navigate("/welcome");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/auth/logout",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsUserAuth(false);
        // setUserData({});
        userContext.setUserDataState({});
        verifyUserAuth(new AbortController());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyUserAuth = async (controller) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/auth/verify",
        {
          withCredentials: true,
          signal: controller.signal,
        }
      );

      try {
        const { data, status } = await axios.get(
          `http://localhost:3001/api/users/${response.data?.id}`,
          { withCredentials: true }
        );
        if (status === 200) {
          // setUserData({ id: data.id, username: data.username });
          userContext.setUserDataState({
            id: data.id,
            username: data.username,
          });
          setIsUserAuth(true);
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        navigate("/welcome");
      }
    } catch (error) {
      console.log(error);
      navigate("/welcome");
    }
  };

  // const updateUserData = async ({ username = null, password = null } = {}) => {
  //   if (!username && !password) return;

  //   if (username === userData.username) return;
  //   try {
  //     const { data } = await axios.patch(
  //       `http://localhost:3001/api/users/${userData?.id}`,
  //       {
  //         username,
  //         password,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     if (data) {
  //       setUserData(data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    const controller = new AbortController();
    verifyUserAuth(controller);

    return () => {
      controller.abort();
    };
  }, []);

  const values = {
    // userData,
    // setUserData,
    isUserAuth,
    setIsUserAuth,
    loginUser,
    logoutUser,
    verifyUserAuth,
    // updateUserData,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
