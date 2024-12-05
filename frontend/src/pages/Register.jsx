import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs(username, password, passwordConfirm))
      return console.log("Error with input fields.");
    try {
      const response = await axios.post("http://localhost:3001/users", {
        username,
        hash: password,
      });
      setUserData(response?.data);
      clearInputs();
      setIsUserRegistered(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      throw new Error(error);
    }
  };

  const clearInputs = () => {
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
      {isUserRegistered && (
        <div className="p-3 absolute bottom-4 right-4 bg-base-neutral text-white rounded-md">
          User with id: {userData?.id} Successfully created{" "}
        </div>
      )}
      <h1 className="mb-10 text-white text-6xl font-bold">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="p-12 bg-base-neutral rounded-xl flex flex-col gap-y-4"
      >
        <input
          type="text"
          placeholder="User name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Re-enter Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <button className="py-1 bg-primary/85 hover:bg-primary/70 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
