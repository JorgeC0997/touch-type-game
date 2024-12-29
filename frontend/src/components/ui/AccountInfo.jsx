import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../context/AccountContext";
import RoundedBadge from "./RoundedBadge";
import { ScoreContext } from "../../context/ScoreContext";
import WPM from "./WPM";
import editIcon from "../../assets/edit_square.svg";
import ChangeUsernameForm from "../forms/ChangeUsernameForm";
import ChangePasswordForm from "../forms/ChangePasswordForm";
import { UserContext } from "../../context/UserContext";

const AccountInfo = () => {
  const userContext = useContext(UserContext);
  const accountContext = useContext(AccountContext);
  const scoreContext = useContext(ScoreContext);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [showPasswordForm, setShowPasswordFrom] = useState(false);

  const badgeContent = accountContext.accountData?.is_super_user
    ? "superuser"
    : accountContext.accountData?.level;

  // const getBgStyles = () => {
  //   switch (accountContext.accountData?.level) {
  //     case 1:
  //       return "bg-amber-600";

  //     case 2:
  //       return "bg-slate-400";

  //     case 3:
  //       return "bg-amber-400";

  //     default:
  //       return "bg-amber-600";
  //   }
  // };
  return (
    <div className="w-full">
      <div
        className={`bg-base-dark p-4 flex justify-center items-center rounded-t-xl text-white`}
      >
        {showUsernameForm ? (
          <ChangeUsernameForm onCancel={() => setShowUsernameForm(false)} />
        ) : (
          <h1 className="pr-2 text-5xl font-semibold">
            {userContext.userData.username}
            <sup>
              <button
                onClick={() => setShowUsernameForm(true)}
                className="p-0.5 bg-transparent hover:bg-base-neutral rounded-md"
              >
                <img src={editIcon} />
              </button>
            </sup>
          </h1>
        )}

        <div className="pl-2 border-l border-slate-200 flex flex-col items-center">
          <div className="p-2 bg-base-neutral flex flex-col justify-center items-center rounded-md shadow-md">
            <p>Level</p>
            <RoundedBadge badgeContent={badgeContent} size="md" />
          </div>
          <WPM totalWPM={scoreContext.highestScore} size="sm" />
        </div>
      </div>
      <div className="py-4 bg-black/10 w-full flex flex-col justify-center items-center rounded-b-xl text-black">
        {showPasswordForm ? (
          <ChangePasswordForm onCancel={() => setShowPasswordFrom(false)} />
        ) : (
          <div>
            <button
              type="button"
              className="hover:underline hover:opacity-70"
              onClick={() => setShowPasswordFrom(true)}
            >
              Forgot password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
