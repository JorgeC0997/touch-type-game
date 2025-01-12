import React, { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ModalContext } from "../../context/ModalContext";
import AccountInfo from "../ui/AccountInfo";
import UserLogo from "../ui/UserLogo";
import NotificationBox from "../ui/NotificationBox";
import { NotificationContext } from "../../context/NotificationContext";

const NavBar = () => {
  const notificationContext = useContext(NotificationContext);
  const authContext = useContext(AuthContext);
  const modalContext = useContext(ModalContext);

  // This will activate the modal using AccountInfo component as the content of the modal
  const openAccountInfo = () => {
    modalContext.activateModal(() => {
      return <AccountInfo />;
    });
  };

  return (
    <nav className="p-4 fixed top-0 left-0 w-full flex justify-between align-center bg-white text-black z-10">
      <Link to="/">
        <p className="my-auto h-auto text-lg font-righteous">Touch Type _</p>
      </Link>

      {notificationContext.message && (
        <NotificationBox
          message={notificationContext.message}
          type={notificationContext.type}
          duration={notificationContext.duration}
        />
      )}

      {authContext.isUserAuth ? (
        <ul className="flex gap-x-4">
          <button onClick={openAccountInfo}>
            <UserLogo />
          </button>

          <button
            onClick={() => {
              authContext.logoutUser();
            }}
          >
            Log Out
          </button>
        </ul>
      ) : (
        <Link to="/register">Register</Link>
      )}
    </nav>
  );
};

export default NavBar;
