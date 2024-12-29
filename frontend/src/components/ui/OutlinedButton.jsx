import React from "react";

const OutlinedButton = ({
  action = () => {},
  legend = "Submit",
  type = "submit",
  theme = "light",
}) => {
  let btnStyles = "";
  switch (theme) {
    case "light":
      btnStyles = "text-gray-800 border-gray-500";
      break;

    case "dark":
      btnStyles = "text-white border-white";
      break;

    default:
      btnStyles = "text-gray-800 border-black";
      break;
  }
  return (
    <button
      type={type}
      onClick={action}
      className={`${btnStyles} px-2 py-0.5 text-l font-medium rounded-md border-2 hover:opacity-80`}
    >
      {legend}
    </button>
  );
};

export default OutlinedButton;
