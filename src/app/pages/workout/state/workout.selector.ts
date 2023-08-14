import {
  createSelector,
  DefaultProjectorFn,
  MemoizedSelector,
} from '@ngrx/store';
import { AppState, IExercise } from '@gymTrack/core';
import { ExerciseFeatureKey, ExerciseState } from './workout.state';

export interface FeatureState {
  counter: number;
}

export const selectExerciseFeature = (state: AppState) => state.exercises;

//concatename selectors
export const selectListExercise: MemoizedSelector<
  AppState,
  Array<any> | null,
  DefaultProjectorFn<any | null>
> = createSelector(
  selectExerciseFeature,
  (state: ExerciseState) => state[ExerciseFeatureKey]
);

export const selectNamesList = createSelector(selectListExercise, (Exercise) =>
  Exercise?.map((user) => user.name)
);
