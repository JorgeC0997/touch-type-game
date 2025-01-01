import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { UserContext } from "./UserContext";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const userContext = useContext(UserContext);
  const [isUserAuth, setIsUserAuth] = useState(false);
  const navigate = useNavigate();

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
        userContext.setUserDataState(data);
        setIsUserAuth(true);
        navigate("/");
        return true;
      } else {
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

  useEffect(() => {
    const controller = new AbortController();
    verifyUserAuth(controller);

    return () => {
      controller.abort();
    };
  }, []);

  const values = {
    isUserAuth,
    setIsUserAuth,
    loginUser,
    logoutUser,
    verifyUserAuth,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
