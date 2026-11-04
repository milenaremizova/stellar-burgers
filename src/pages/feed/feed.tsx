import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  fetchFeeds,
  selectFeedLoading,
  selectFeedOrders,
} from '../../services/slices/feed-slice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  // TODO: Взять переменную из стора
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);

  useEffect(() => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    // TODO: Запросить ленту заказов
    void dispatch(fetchFeeds());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
