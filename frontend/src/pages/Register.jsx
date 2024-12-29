import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import StyledInput from "../components/ui/StyledInput";
import PrimaryButton from "../components/ui/PrimaryButton";

const Register = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [inputError, setInputError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs(username, password, passwordConfirm)) {
      setInputError(true);
      return console.log("Error with input fields.");
    }
    try {
      const response = await axios.post("http://localhost:3001/api/users", {
        username,
        password,
      });
      if (!response) return navigate("/register");
      clearInputs();
      authContext.loginUser(username, password);
    } catch (error) {
      setInputError(true);
      throw new Error(error);
    }
  };

  const clearInputs = () => {
    setInputError(false);
    setUsername("");
    setPassword("");
    setPasswordConfirm("");
  };

  const validateInputs = (username, hash, confirmHash) => {
    if (username.length <= 0 || hash.length <= 0 || confirmHash.length <= 0) {
      console.log("All Fields must have some value");
      return false;
    }

    if (hash !== confirmHash) {
      console.log("passwords don't match");
      return false;
    }
    return true;
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col text-black">
      <h1 className="mb-10 text-white text-6xl font-bold">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="p-12 bg-base-neutral rounded-xl flex flex-col gap-y-4"
      >
        <StyledInput
          type="text"
          placeholder="User Name"
          errorState={inputError}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (inputError) setInputError(false);
          }}
        />
        <StyledInput
          type="password"
          placeholder="Password"
          errorState={inputError}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (inputError) setInputError(false);
          }}
        />
        <StyledInput
          type="password"
          placeholder="Re-enter Password"
          errorState={inputError}
          value={passwordConfirm}
          onChange={(e) => {
            setPasswordConfirm(e.target.value);
            if (inputError) setInputError(false);
          }}
        />
        {inputError && (
          <p className="text-white text-sm">
            *Username and/or password is wrong
          </p>
        )}
        <PrimaryButton legend="Register" />
      </form>
    </div>
  );
};

export default Register;
