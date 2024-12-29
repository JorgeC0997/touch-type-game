import React from "react";

const WPM = ({ totalWPM = 0, size = "md" }) => {
  let mainstyle = "";
  let scoreStyle = "";
  let wpmStyle = "";
  switch (size) {
    case "sm":
      mainstyle = "mt-6";
      scoreStyle = "bottom-2.5 text-[1.5rem]";
      wpmStyle = "text-sm";
      break;
    case "md":
      mainstyle = "mt-8";
      scoreStyle = "bottom-2 text-[3rem]";
      wpmStyle = "text-lg";
      break;
    case "lg":
      mainstyle = "mt-12";
      scoreStyle = "bottom-1 text-[4rem]";
      wpmStyle = "text-xl";
      break;
    case "xl":
      mainstyle = "mt-28";
      scoreStyle = "bottom-1 text-[8rem]";
      wpmStyle = "text-4xl";
      break;

    default:
      mainstyle = "mt-8";
      scoreStyle = "bottom-2 text-[3rem]";
      wpmStyle = "text-lg";
      break;
  }
  return (
    <div className={`relative text-center ${mainstyle}`}>
      <p
        className={`absolute left-1/2 translate-x-[-50%] font-bold ${scoreStyle}`}
      >
        {totalWPM}
      </p>
      <p className={`font-bold text-primary ${wpmStyle}`}>-WPM-</p>
    </div>
  );
};

export default WPM;
