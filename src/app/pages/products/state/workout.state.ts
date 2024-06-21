import { Action, createReducer, on } from '@ngrx/store';
import { loadedExercise } from './workout.actions';
import { IExercise } from '@gymTrack/core';
import { ArticleItemResponse, ArticleResponse } from '../models';

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
  }))
);

export function ExerciseReducer(state: any, action: Action) {
  return _ExerciseReducer(state, action);
}
