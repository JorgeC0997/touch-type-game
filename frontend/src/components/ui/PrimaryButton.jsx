import React from "react";

const PrimaryButton = ({
  action = () => {},
  legend = "Submit",
  type = "submit",
}) => {
  return (
    <button
      type={type}
      onClick={action}
      className="px-2 py-1 bg-primary text-white text-l font-medium rounded-md hover:opacity-90"
    >
      {legend}
    </button>
  );
};

export default PrimaryButton;
