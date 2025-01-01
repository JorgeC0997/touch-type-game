import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import PrimaryButton from "../ui/PrimaryButton";
import OutlinedButton from "../ui/OutlinedButton";
import StyledInput from "../ui/StyledInput";
import { UserContext } from "../../context/UserContext";

const ChangeUsernameForm = ({ onCancel }) => {
  const userContext = useContext(UserContext);
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState(userContext.userData?.username);
  const [inputError, setInputError] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (username === "" || username === userContext.userData?.username)
          return onCancel();

        const isDataChanged = await userContext.updateUserData({
          username: username,
        });

        if (!isDataChanged) {
          setInputError(true);
        } else {
          setUsername("");
          setInputError(false);
          onCancel();
        }
      }}
      className="pr-2 flex flex-col items-end gap-2"
    >
      <StyledInput
        type="text"
        onChange={(e) => {
          setUsername(e.target.value);
          if (inputError) setInputError(false);
        }}
        errorState={inputError}
        value={username}
        extraStyles={"w-36 text-right"}
      />
      <div className="w-full flex justify-between">
        <OutlinedButton
          type="button"
          action={() => {
            onCancel();
          }}
          legend="Cancel"
          theme="dark"
        />
        <PrimaryButton legend="Update" />
      </div>
    </form>
  );
};

export default ChangeUsernameForm;
