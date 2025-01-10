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

        // Hide the form if username entered is empty or if the username entered
        // is the same as current username.
        if (username === "" || username === userContext.userData?.username)
          return onCancel();

        // Await the update dunction to set the new userame
        // if successful, return true.
        const isDataChanged = await userContext.updateUserData({
          username: username,
        });

        // Show error if username couldn't be saved in db
        if (!isDataChanged) {
          setInputError(true);
        } else {
          // if dataChanged is true: reset all states and hide the form.
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
