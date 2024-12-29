import { createContext, useState } from "react";

export const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [content, setContent] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);

  const activateModal = (content, redirectOnClose = null) => {
    if (redirectOnClose) {
      setRedirectUrl(redirectOnClose);
    }
    setIsActive(true);
    setContent(content);
  };

  const getContent = () => {
    return content;
  };

  const hideModal = () => {
    setIsActive(false);
  };

  const values = {
    isActive,
    activateModal,
    getContent,
    hideModal,
    redirectUrl,
  };

  return (
    <ModalContext.Provider value={values}>{children}</ModalContext.Provider>
  );
};
