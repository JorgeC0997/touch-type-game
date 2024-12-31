import React, { useContext } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import userLogo from '../../assets/user_logo.svg';
import { ModalContext } from '../../context/ModalContext';
import AccountInfo from '../ui/AccountInfo';
import { AccountContext } from '../../context/AccountContext';
import UserLogo from '../ui/UserLogo';

const NavBar = () => {
  const authContext = useContext(AuthContext);
  const accountContext = useContext(AccountContext);
  const modalContext = useContext(ModalContext);

  const openAccountInfo = () => {
    modalContext.activateModal(() => {
      return <AccountInfo />;
    });
  };
  return (
    <nav className='p-4 fixed top-0 left-0 w-full flex justify-between align-center bg-white text-black z-10'>
      <Link to='/'>
        <p className='my-auto h-auto text-lg font-righteous'>Touch Type _</p>
      </Link>

      {authContext.isUserAuth ? (
        <ul className='flex gap-x-4'>
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
        <Link to='/register'>Register</Link>
      )}
    </nav>
  );
};

export default NavBar;
