import { createContext, useState } from "react";

export const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
  // Determines if modal is shown or not
  const [isActive, setIsActive] = useState(false);
  // JSX content inside the modal
  const [content, setContent] = useState(null);
  // Optional URL to redirect on Close action button
  const [redirectUrl, setRedirectUrl] = useState(null);

  // This function takes in 2 arguments:
  // Content: It holds the jsx that will be displayed in the modal
  // redirectOnClose: This is the URL used to redirect when user clicks the "Close" button.
  //                  If no URL is passed, the "Close" button will simply
  //                  close the modal.
  const activateModal = (content, redirectOnClose = null) => {
    if (redirectOnClose) {
      setRedirectUrl(redirectOnClose);
    }
    setIsActive(true);
    setContent(content);
  };

  // This will be called in the Modal Component as a children
  const getContent = () => {
    return content;
  };

  // Changing isActive state to false will cause the modal component to not be rendered
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
