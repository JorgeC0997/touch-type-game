import { useState } from "react";
import { createContext } from "react";

export const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState(null);
  const [duration, setDuration] = useState(0);
  const [timeoutNotification, setTimeoutNotification] = useState(null);

  const notify = ({ msg, type = "default", delay = 0 } = {}) => {
    // Throw error if missing parameters
    if (!msg || !type)
      throw new Error("Uncompleted attributes for method notify()");

    // Clear any previous timeouts
    clearTimeout(timeoutNotification);

    // Set all parameters used in NotificationBox component
    setType(type);
    setMessage(msg);
    setDuration(delay);

    // if delay is 0 we dont set a new timeout so NotificationBox component
    // dont get removed from the nav bar
    if (delay <= 0) return;

    // if delay is greater than 0 we set a timeout
    // to remove NotificationBox from the nav bar
    setTimeoutNotification(setTimeout(() => clearNotification(), delay + 1000));
  };

  const clearNotification = () => {
    // Reset all state to default values
    setType(null);
    setMessage(null);
    setDuration(0);
    setTimeoutNotification(null);
  };

  const values = { message, type, duration, notify, clearNotification };

  return (
    <NotificationContext.Provider value={values}>
      {children}
    </NotificationContext.Provider>
  );
};
