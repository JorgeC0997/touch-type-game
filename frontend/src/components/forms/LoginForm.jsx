import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import StyledInput from "../ui/StyledInput";
import PrimaryButton from "../ui/PrimaryButton";
import { NotificationContext } from "../../context/NotificationContext";

const LoginForm = () => {
  const notificationContext = useContext(NotificationContext);
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // await the login function with username and password as parguments needed
    await authContext.loginUser(username, password);
  };
  return (
    <form
      onSubmit={handleSubmit}
      method="post"
      className="p-12 bg-base-neutral rounded-xl flex flex-col gap-y-4"
    >
      <StyledInput
        type="text"
        placeholder="User Name"
        errorState={notificationContext.type === "error" ? true : false}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <StyledInput
        type="password"
        placeholder="Password"
        errorState={notificationContext.type === "error" ? true : false}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      {notificationContext.type === "error" && (
        <p className="text-white text-sm">*Username and/or password is wrong</p>
      )}
      <PrimaryButton legend="Log in" />
    </form>
  );
};

export default LoginForm;
