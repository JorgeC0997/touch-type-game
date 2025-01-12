import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import StyledInput from "../components/ui/StyledInput";
import PrimaryButton from "../components/ui/PrimaryButton";
import { UserContext } from "../context/UserContext";
import { NotificationContext } from "../context/NotificationContext";

const Register = () => {
  const notificationContext = useContext(NotificationContext);
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs(username, password, passwordConfirm)) return;

    const isUserCreated = await userContext.createUser(username, password);

    if (isUserCreated) {
      clearInputs();
      authContext.loginUser(username, password);
    }
  };

  const clearInputs = () => {
    setUsername("");
    setPassword("");
    setPasswordConfirm("");
  };

  const validateInputs = (username, hash, confirmHash) => {
    if (username.length <= 0 || hash.length <= 0 || confirmHash.length <= 0) {
      notificationContext.notify({
        msg: "All Fields must have some value",
        type: "error",
      });
      return false;
    }

    if (hash !== confirmHash) {
      notificationContext.notify({
        msg: "Passwords don't match",
        type: "error",
      });
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
          errorState={notificationContext.type === "error" ? true : false}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <StyledInput
          type="password"
          placeholder="Password"
          errorState={notificationContext.type === "error" ? true : false}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <StyledInput
          type="password"
          placeholder="Re-enter Password"
          errorState={notificationContext.type === "error" ? true : false}
          value={passwordConfirm}
          onChange={(e) => {
            setPasswordConfirm(e.target.value);
          }}
        />
        {notificationContext.type === "error" && (
          <p className="text-white text-sm">*{notificationContext.message}</p>
        )}
        <PrimaryButton legend="Register" />
      </form>
    </div>
  );
};

export default Register;
