import {
  addIngredient,
  burgerConstructorSlice,
  initialState,
  moveIngredient,
  removeIngredient,
  resetConstructor,
} from '../constructor-slice';
import { createOrder } from '../order-slice';
import { mockBun, mockMain, mockSauce, mockSecondBun } from './mock-data';

import type { TConstructorState } from '@utils-types';

const reducer = burgerConstructorSlice.reducer;

describe('burgerConstructorSlice: редьюсер конструктора бургера', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  describe('добавление ингредиента addIngredient', () => {
    test('булочка сохраняется в bun', () => {
      const state = reducer(initialState, addIngredient(mockBun));

      expect(state.bun).toEqual({ ...mockBun, id: expect.any(String) as string });
      expect(state.ingredients).toHaveLength(0);
    });

    test('начинка добавляется в ingredients', () => {
      const state = reducer(initialState, addIngredient(mockMain));

      expect(state.ingredients).toEqual([
        { ...mockMain, id: expect.any(String) as string },
      ]);
      expect(state.bun).toBeNull();
    });

    test('новая булка заменяет предыдущую', () => {
      const stateWithBun = { ...initialState, bun: { ...mockBun, id: 'bun-1' } };
      const state = reducer(stateWithBun, addIngredient(mockSecondBun));

      expect(state.bun).toEqual({ ...mockSecondBun, id: expect.any(String) as string });
    });
  });

  describe('изменение начинок', () => {
    const stateWithFillings: TConstructorState = {
      bun: null,
      ingredients: [
        { ...mockMain, id: 'main-1' },
        { ...mockSauce, id: 'sauce-1' },
      ],
    };

    test('removeIngredient удаляет начинку по id', () => {
      const state = reducer(stateWithFillings, removeIngredient('main-1'));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('sauce-1');
    });

    test('moveIngredient меняет порядок начинок', () => {
      const state = reducer(stateWithFillings, moveIngredient({ from: 0, to: 1 }));

      expect(state.ingredients[0].id).toBe('sauce-1');
      expect(state.ingredients[1].id).toBe('main-1');
    });
  });

  describe('очистка конструктора', () => {
    const filledState: TConstructorState = {
      bun: { ...mockBun, id: 'bun-1' },
      ingredients: [{ ...mockMain, id: 'main-1' }],
    };

    test('resetConstructor очищает конструктор', () => {
      const state = reducer(filledState, resetConstructor());

      expect(state).toEqual(initialState);
    });

    test('createOrder.fulfilled очищает конструктор после оформления заказа', () => {
      const state = reducer(filledState, { type: createOrder.fulfilled.type });

      expect(state).toEqual(initialState);
    });
  });
});
