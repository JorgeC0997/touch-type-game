import React, { useContext, useState } from "react";
import userLogo from "../../assets/user_logo.svg";
import { AccountContext } from "../../context/AccountContext";
import RoundedBadge from "./RoundedBadge";

const UserLogo = () => {
  const accountContext = useContext(AccountContext);
  let badgeContent = accountContext.accountData?.is_super_user
    ? "superuser"
    : accountContext.accountData?.level;
  const getBgStyles = () => {
    switch (accountContext.accountData?.level) {
      case 1:
        return "bg-amber-600 border-amber-700 hover:bg-amber-700/80";

      case 2:
        return "bg-slate-400 border-slate-500 hover:bg-slate-500/80";

      case 3:
        return "bg-amber-400 border-amber-500 hover:bg-amber-500/80";

      default:
        return "bg-amber-600";
    }
  };
  return (
    <div
      className={`${getBgStyles()} border-2 rounded-md text-white flex justify-center items-center`}
    >
      <img src={userLogo} className={`w-[30px]`} />
      <div className="pl-2 pr-1 ml-2 border-l border-white">
        {accountContext.accountData?.is_super_user ? (
          badgeContent
        ) : (
          <RoundedBadge badgeContent={badgeContent} size="sm" />
        )}
      </div>
    </div>
  );
};

export default UserLogo;
