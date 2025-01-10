import React from "react";

// badge content will be the accounts level or superuser.
const RoundedBadge = ({ badgeContent, size = "md" }) => {
  let style = "";

  // Set the badge size based on size provided
  switch (size) {
    case "sm":
      style = "w-[24px] h-[24px] text-lg border-2";
      break;

    case "md":
      style = "w-[30px] h-[30px] text-xl border-2";
      break;

    case "lg":
      style = "w-[40px] h-[40px] text-3xl border-[3px]";
      break;

    default:
      break;
  }
  return (
    <div
      className={`${style}  rounded-full border-white flex justify-center items-center`}
    >
      {badgeContent}
    </div>
  );
};

export default RoundedBadge;
