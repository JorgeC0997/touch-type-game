import React, { useState } from "react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ username, password });
  };
  return (
    <form
      onSubmit={handleSubmit}
      method="post"
      className="p-12 bg-base-neutral rounded-xl flex flex-col gap-y-4"
    >
      <input
        type="text"
        placeholder="User Name"
        onChange={(e) => setUsername(e.target.value)}
        className="px-3 h-8 text-lg bg-base-light rounded-lg border-2 border-gray-500"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Log in</button>
    </form>
  );
};

export default LoginForm;
