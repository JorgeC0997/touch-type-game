import React from "react";
import Logo from "../components/ui/Logo";
import LoginForm from "../components/forms/LoginForm";

const Welcome = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Logo />
      <LoginForm />
    </div>
  );
};

export default Welcome;
