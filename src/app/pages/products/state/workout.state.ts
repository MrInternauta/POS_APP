import { Action, createReducer, on } from '@ngrx/store';
import { ArticleResponse } from '../models';
import { loadedExercise, loadedMoreExercise } from './workout.actions';

export const ExerciseFeatureKey = 'Exercise';
export interface ExerciseState {
  [ExerciseFeatureKey]: ArticleResponse | null;
}

export const exerciseInitialState: ExerciseState = {
  [ExerciseFeatureKey]: null,
};

const _ExerciseReducer = createReducer(
  exerciseInitialState,
  on(loadedExercise, (state, { Exercise }) => ({
    ...state,
    [ExerciseFeatureKey]: Exercise,
  })),
  //A next page keeps the products already loaded and appends the new ones
  on(loadedMoreExercise, (state, { Exercise }) => ({
    ...state,
    [ExerciseFeatureKey]: {
      ...Exercise,
      products: [...(state[ExerciseFeatureKey]?.products || []), ...(Exercise?.products || [])],
    },
  }))
);

export function ExerciseReducer(state: any, action: Action) {
  return _ExerciseReducer(state, action);
}
