import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { selectFeedOrders } from '../../services/slices/feed-slice';
import { selectIngredients } from '../../services/slices/ingredients-slice';
import {
  fetchOrderByNumber,
  selectOrderDetails,
} from '../../services/slices/order-slice';
import { selectProfileOrders } from '../../services/slices/profile-orders-slice';
import { useDispatch, useSelector } from '../../services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);

  /** TODO: взять переменные orderData и ingredients из стора */
  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const orderDetails = useSelector(selectOrderDetails);

  /* Сначала ищем заказ среди уже загруженных (лента или история),
     а при прямом переходе по ссылке запрашиваем его с сервера. */
  const orderData =
    feedOrders.find((order) => order.number === orderNumber) ??
    profileOrders.find((order) => order.number === orderNumber) ??
    (orderDetails?.number === orderNumber ? orderDetails : null);

  useEffect(() => {
    if (!orderData && orderNumber) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
