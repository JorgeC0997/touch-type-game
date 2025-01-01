import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import StyledInput from "../ui/StyledInput";
import PrimaryButton from "../ui/PrimaryButton";

const LoginForm = () => {
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inputError, setInputError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUserLoggedin = await authContext.loginUser(username, password);
    if (!isUserLoggedin) {
      setInputError(true);
    } else {
      setUsername("");
      setPassword("");
      setInputError(false);
    }
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
        errorState={inputError}
        onChange={(e) => {
          setUsername(e.target.value);
          if (inputError) setInputError(false);
        }}
      />
      <StyledInput
        type="password"
        placeholder="Password"
        errorState={inputError}
        onChange={(e) => {
          setPassword(e.target.value);
          if (inputError) setInputError(false);
        }}
      />
      {inputError && (
        <p className="text-white text-sm">*Username and/or password is wrong</p>
      )}
      <PrimaryButton legend="Log in" />
    </form>
  );
};

export default LoginForm;
