import { selectFeed } from '@/services/slices/feed-slice';
import { useSelector } from '@/services/store';
import { FeedInfoUI } from '@ui';

import type { TOrder } from '@utils-types';

const MAX_ORDERS_IN_COLUMN = 15;

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, MAX_ORDERS_IN_COLUMN);

export const FeedInfo = (): React.JSX.Element => {
  const feed = useSelector(selectFeed);

  const readyOrders = getOrders(feed.orders, 'done');

  const pendingOrders = getOrders(feed.orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
