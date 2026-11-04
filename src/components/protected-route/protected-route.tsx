import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectUser } from '../../services/slices/user-slice';
import { useSelector } from '../../services/store';

import type { TProtectedRouteProps, TProtectedRouteState } from './type';

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: TProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  // Пока не знаем, авторизован ли пользователь, ничего не решаем
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Неавторизованного отправляем на вход и запоминаем, куда он шёл
  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Авторизованного со страниц входа/регистрации возвращаем туда, откуда пришёл
  if (onlyUnAuth && user) {
    const { from } = (location.state as TProtectedRouteState | null) ?? {};
    return <Navigate to={from ?? { pathname: '/' }} replace />;
  }

  return children;
};
