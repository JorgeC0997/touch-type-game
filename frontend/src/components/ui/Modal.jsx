import React, { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";
import { useNavigate } from "react-router";
import PrimaryButton from "./PrimaryButton";

const Modal = ({ children }) => {
  const modalContext = useContext(ModalContext);
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 right-0  w-dvw, h-dvh bg-black/30 flex justify-center items-center z-10">
      <div className="p-4 bg-base-light rounded-2xl min-w-80 text-black flex flex-col justify-center items-center">
        {children}
        <section className="pt-6 w-full text-center">
          <PrimaryButton
            action={() => {
              modalContext.hideModal();
              // redirect on close if redirectUrl was provided
              if (modalContext.redirectUrl) {
                navigate(modalContext.redirectUrl);
              }
            }}
            legend="Close"
            type="button"
          />
        </section>
      </div>
    </div>
  );
};

export default Modal;
