import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { loginUser, selectUserError } from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* После успешного входа ProtectedRoute сам вернёт пользователя
     на страницу, с которой его перенаправили на логин. */
  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
