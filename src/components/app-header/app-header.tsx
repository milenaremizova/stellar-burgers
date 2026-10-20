import { AppHeaderUI } from '@ui';

import { selectUser } from '../../services/slices/user-slice';
import { useSelector } from '../../services/store';

export const AppHeader = (): React.JSX.Element => {
  /* TODO: Получите имя пользователя из хранилища */
  const user = useSelector(selectUser);

  return <AppHeaderUI userName={user?.name} />;
};
