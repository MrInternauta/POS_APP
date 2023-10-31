import {
  createSelector,
  DefaultProjectorFn,
  MemoizedSelector,
} from '@ngrx/store';
import { AppState } from '@gymTrack/core';
import { CartFeatureKey, CartInfo, CartState } from './cart.state';

export const selectExerciseFeature = (state: AppState) => state.cart;

export const selectListCart: MemoizedSelector<
  AppState,
  any | null,
  DefaultProjectorFn<any | null>
> = createSelector(
  selectExerciseFeature,
  (state: CartState) => state[CartFeatureKey]
);

export const selectTotal: MemoizedSelector<
  AppState,
  any | null,
  DefaultProjectorFn<any | null>
> = createSelector(selectExerciseFeature, (state: CartState) => {
  if (!state[CartFeatureKey]) {
    return state[CartFeatureKey];
  }

  const values = Object.values(state[CartFeatureKey] as unknown as CartInfo);

  return values.reduce((prev, current, index) => {
    return (
      Number(prev) +
      Number(current?.quantity) * Number(current?.article?.priceSell || 0)
    );
  }, 0);
});
