import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { SerializedError } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: SerializedError | null;
  orderDetails: TOrder | null;
  isOrderDetailsLoading: boolean;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderError: null,
  orderDetails: null,
  isOrderDetailsLoading: false,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber);
    return response.orders[0] ?? null;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
      state.orderError = null;
    },
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderDetails: (state) => state.orderDetails,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isOrderDetailsLoading = true;
        state.orderDetails = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isOrderDetailsLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.isOrderDetailsLoading = false;
      });
  },
});

export const { clearOrderModalData } = orderSlice.actions;

export const { selectOrderRequest, selectOrderModalData, selectOrderDetails } =
  orderSlice.selectors;
