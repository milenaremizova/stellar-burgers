import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import {
  selectUpdateUserError,
  selectUser,
  updateUser,
} from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';

import type { TRegisterData } from '@api';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  /* TODO: Взять переменную из стора */
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUpdateUserError);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name ?? '',
      email: user?.email ?? '',
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    const changedData: Partial<TRegisterData> = {
      name: formValue.name,
      email: formValue.email,
    };
    if (formValue.password) {
      changedData.password = formValue.password;
    }

    void dispatch(updateUser(changedData)).then((result) => {
      if (updateUser.fulfilled.match(result)) {
        setFormValue((prevState) => ({ ...prevState, password: '' }));
      }
    });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError ?? undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
