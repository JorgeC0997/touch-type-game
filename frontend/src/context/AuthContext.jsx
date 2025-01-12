import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "./UserContext";
import { NotificationContext } from "./NotificationContext";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const notificationContext = useContext(NotificationContext);
  const userContext = useContext(UserContext);
  const [isUserAuth, setIsUserAuth] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (username, password) => {
    // Send username and password to login user.
    // we use withCredentials because the api endpoint will
    // set a http-only cookie saving the newly created jwt.
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

      // the api endpoint will return the id and username
      // if the data attribute isn't empty,
      // - store id and user in UserContext
      // - set boolean isUserAuth to true
      // - redirect user to Home page
      // Now with the jwt created, the Home page will be accessible
      if (data) {
        userContext.setUserDataState(data);
        setIsUserAuth(true);
        notificationContext.clearNotification();
        notificationContext.notify({
          msg: `Welcome, ${data.username}`,
          delay: 3000,
        });
        navigate("/");
      } else {
        // for safety, if data attribute is empty, we set everything to default state
        // and redirect to Welcome page
        userContext.setUserDataState(null);
        notificationContext.clearNotification();
        setIsUserAuth(false);
        navigate("/welcome");
      }
    } catch (error) {
      // In case of error, trigger the notification box with message from api
      notificationContext.notify({
        msg: error.response?.data?.message,
        type: "error",
      });
      console.log(error);
    }
  };

  // <----- Check if we can use this.isUserAuth in login form component for error handling ----->

  // Log the user out by reaching to the logout endpoint usgin the current credentials.
  const logoutUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/auth/logout",
        {
          withCredentials: true,
        }
      );

      // If we get a "OK" response, set auth and user context to default values
      // At this point the api endpoint will issue a new jwt
      // with a very short expiration time. when we call verifyAuth, there will be no
      // valid jwt so verifyAuth will redirect to Welcome page
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
      // verify if user has a valid jwt on http-only cookies
      const response = await axios.get(
        "http://localhost:3001/api/auth/verify",
        {
          withCredentials: true,
          signal: controller.signal,
        }
      );

      // get the user data (id, username)
      try {
        const { data, status } = await axios.get(
          `http://localhost:3001/api/users/${response.data?.id}`,
          { withCredentials: true }
        );

        // save id and username in userContext
        if (status === 200) {
          userContext.setUserDataState({
            id: data.id,
            username: data.username,
          });

          // change boolean value
          setIsUserAuth(true);

          //redirect user to Home page
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        // if no user data found redirect to Welcome page
        navigate("/welcome");
      }
    } catch (error) {
      console.log(error);
      // if no valid JWT redirect to Welcome page
      navigate("/welcome");
    }
  };

  // Verify user every time the app refreshes
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
