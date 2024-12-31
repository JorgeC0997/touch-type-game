import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import StyledInput from '../components/ui/StyledInput';
import PrimaryButton from '../components/ui/PrimaryButton';
import { UserContext } from '../context/UserContext';

const Register = () => {
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [inputError, setInputError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs(username, password, passwordConfirm)) {
      setInputError(true);
      return console.log('Error with input fields.');
    }

    const isUserCreated = await userContext.createUser(username, password);

    if (!isUserCreated) {
      setInputError(true);
      return;
    }

    clearInputs();
    authContext.loginUser(username, password);
  };

  const clearInputs = () => {
    setErrorMessage('');
    setInputError(false);
    setUsername('');
    setPassword('');
    setPasswordConfirm('');
  };

  const validateInputs = (username, hash, confirmHash) => {
    if (username.length <= 0 || hash.length <= 0 || confirmHash.length <= 0) {
      setErrorMessage('All Fields must have some value');
      return false;
    }

    if (hash !== confirmHash) {
      setErrorMessage("passwords don't match");
      return false;
    }
    return true;
  };

  return (
    <div className='w-screen h-screen flex justify-center items-center flex-col text-black'>
      <h1 className='mb-10 text-white text-6xl font-bold'>Register</h1>
      <form
        onSubmit={handleSubmit}
        className='p-12 bg-base-neutral rounded-xl flex flex-col gap-y-4'
      >
        <StyledInput
          type='text'
          placeholder='User Name'
          errorState={inputError}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (inputError) setInputError(false);
          }}
        />
        <StyledInput
          type='password'
          placeholder='Password'
          errorState={inputError}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (inputError) setInputError(false);
          }}
        />
        <StyledInput
          type='password'
          placeholder='Re-enter Password'
          errorState={inputError}
          value={passwordConfirm}
          onChange={(e) => {
            setPasswordConfirm(e.target.value);
            if (inputError) setInputError(false);
          }}
        />
        {inputError && <p className='text-white text-sm'>*{errorMessage}</p>}
        <PrimaryButton legend='Register' />
      </form>
    </div>
  );
};

export default Register;
