import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import StyledInput from "../ui/StyledInput";
import OutlinedButton from "../ui/OutlinedButton";
import PrimaryButton from "../ui/PrimaryButton";
import { AuthContext } from "../../context/AuthContext";
import { ModalContext } from "../../context/ModalContext";

const ChangePasswordForm = ({ onCancel }) => {
  const userContext = useContext(UserContext);
  const authContext = useContext(AuthContext);
  const modalContext = useContext(ModalContext);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [inputError, setInputError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (newPassword !== newPasswordConfirm) {
          setErrorMessage("Both password fields must match");
          return setInputError(true);
        }

        const isDataChanged = await userContext.updateUserData({
          password: newPassword,
        });

        if (!isDataChanged) {
          setInputError(true);
          setErrorMessage("Invalid password");
        } else {
          setNewPassword("");
          setNewPasswordConfirm("");
          setErrorMessage("");
          setInputError(false);
          onCancel();
          modalContext.hideModal();
          authContext.logoutUser();
        }
      }}
      className="pr-2 flex flex-col items-start gap-2 w-44"
    >
      <StyledInput
        type="password"
        onChange={(e) => {
          setNewPassword(e.target.value);
          if (inputError) {
            setInputError(false);
            setErrorMessage("");
          }
        }}
        value={newPassword}
        errorState={inputError}
        extraStyles={"w-44 !text-sm"}
        placeholder="New Password"
      />
      <StyledInput
        type="password"
        onChange={(e) => {
          setNewPasswordConfirm(e.target.value);
          if (inputError) {
            setInputError(false);
            setErrorMessage("");
          }
        }}
        value={newPasswordConfirm}
        errorState={inputError}
        extraStyles={"w-44 !text-sm"}
        placeholder="Confirm New Password"
      />
      {inputError && (
        <p className="text-gray-800 text-sm text-wrap">*{errorMessage}</p>
      )}
      <div className="w-full flex justify-between">
        <OutlinedButton
          type="button"
          action={() => {
            onCancel();
          }}
          legend="Cancel"
          theme="light"
        />
        <PrimaryButton legend="Change" />
      </div>
    </form>
  );
};

export default ChangePasswordForm;
