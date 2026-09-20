import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { AppState } from '../../../core/state/app.reducer';
import { ArticleItemResponse } from '../models';
import { ExerciseFeatureKey, ExerciseState } from './workout.state';

export interface FeatureState {
  counter: number;
}

export const selectExerciseFeature = (state: AppState) => state.exercises;

export const selectListExercise: MemoizedSelector<
  AppState,
  ArticleItemResponse | null,
  DefaultProjectorFn<any | null>
> = createSelector(selectExerciseFeature, (state: ExerciseState) => state[ExerciseFeatureKey]);
