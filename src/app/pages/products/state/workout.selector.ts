import {
  createSelector,
  DefaultProjectorFn,
  MemoizedSelector,
} from '@ngrx/store';
import { AppState, IExercise } from '@gymTrack/core';
import { ExerciseFeatureKey, ExerciseState } from './workout.state';
import { ArticleItemResponse } from '../models';

export interface FeatureState {
  counter: number;
}

export const selectExerciseFeature = (state: AppState) => state.exercises;

export const selectListExercise: MemoizedSelector<
  AppState,
  ArticleItemResponse | null,
  DefaultProjectorFn<any | null>
> = createSelector(
  selectExerciseFeature,
  (state: ExerciseState) => state[ExerciseFeatureKey]
);

