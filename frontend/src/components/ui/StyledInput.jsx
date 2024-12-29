import React from "react";

const StyledInput = ({
  onChange = () => {},
  type = "text",
  placeholder = "",
  errorState = false,
  value = undefined,
  extraStyles = null,
}) => {
  const inputErrorStyles = "border-red-600";
  const inputDefaultStyles = "border-gray-500";
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value && value}
      onChange={onChange}
      className={`px-3 h-8 text-lg text-black bg-base-light rounded-lg border-2 ${
        extraStyles && extraStyles
      } ${errorState ? inputErrorStyles : inputDefaultStyles}`}
    />
  );
};

export default StyledInput;
