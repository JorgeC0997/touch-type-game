import React from "react";

const RibbonSign = ({ score = 0, legend = "New Record" }) => {
  return (
    <div className="relative mt-28 mb-2 z-10">
      <p
        style={{ textShadow: "0 0 20px rgba(255, 255, 255, 0.7)" }}
        className="absolute bottom-1 left-1/2 translate-x-[-50%] text-[8rem] font-bold -z-10"
      >
        {score}
      </p>
      <p
        style={{
          background:
            "linear-gradient(90deg, #d97706, #f59e0b 20% 80%, #d97706)",
        }}
        className="py-[10px] px-[30px] rounded-tl-[5px] rounded-tr-[5px] z-10 shadow-xl"
      >
        {legend}
      </p>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60px"
        height="40px"
        className="absolute top-[14px] left-[-40px] -z-10 shadow-xl"
      >
        <polygon points="0,0 60,0 60,40 0,40 20,20" fill="#b45309" />
        <polygon points="60,40 40,30 60,30" fill="#78350f" />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60px"
        height="40px"
        className="absolute top-[14px] right-[-40px] -z-10 shadow-xl"
      >
        <polygon points="60,0 0,0 0,40 60,40 40,20" fill="#b45309" />
        <polygon points="0,40 20,30 0,30" fill="#78350f" />
      </svg>
    </div>
  );
};

export default RibbonSign;
