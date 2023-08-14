import { createAction, props } from '@ngrx/store';
import { IExercise } from '../../../core/models/Iworkout.model';

export const loadExerciseType = '[Exercise] loadExercise Success';
export const loadExercise = createAction(loadExerciseType);

export const loadedExerciseType = '[Exercise] Loaded Exercise Success';
export const loadedExercise = createAction(
  loadedExerciseType,
  props<{ Exercise: any }>()
);
