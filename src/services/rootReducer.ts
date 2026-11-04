import { combineSlices } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from './slices/constructor-slice';
import { feedSlice } from './slices/feed-slice';
import { ingredientsSlice } from './slices/ingredients-slice';
import { orderSlice } from './slices/order-slice';
import { profileOrdersSlice } from './slices/profile-orders-slice';
import { userSlice } from './slices/user-slice';

// TODO: Заменить на настоящий корневой редьюсер
export const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  orderSlice,
  feedSlice,
  profileOrdersSlice,
  userSlice
);
