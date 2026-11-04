import { fetchIngredients, ingredientsSlice, initialState } from '../ingredients-slice';
import { mockBun } from './mock-data';

import type { TIngredient } from '@utils-types';

const reducer = ingredientsSlice.reducer;

const mockIngredients: TIngredient[] = [mockBun];

describe('ingredientsSlice: редьюсер списка ингредиентов', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  describe('загрузка ингредиентов fetchIngredients', () => {
    test('pending: включает загрузку и сбрасывает ошибку', () => {
      const state = reducer(initialState, { type: fetchIngredients.pending.type });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fulfilled: сохраняет ингредиенты и выключает загрузку', () => {
      const loadingState = { ...initialState, isLoading: true };
      const state = reducer(loadingState, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients,
      });

      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.isLoading).toBe(false);
    });

    test('rejected: сохраняет ошибку и выключает загрузку', () => {
      const loadingState = { ...initialState, isLoading: true };
      const state = reducer(loadingState, {
        type: fetchIngredients.rejected.type,
        error: { message: 'ошибка загрузки' },
      });

      expect(state.isLoading).toBe(false);
      expect(state.error?.message).toBe('ошибка загрузки');
    });
  });
});
