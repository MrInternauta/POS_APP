import { createAction, props } from '@ngrx/store';
import { ArticleItemResponse, ArticleResponse } from '../models';

export const loadExerciseType = '[Exercise] loadExercise Success';
export const loadExercise = createAction(loadExerciseType);

export const loadedExerciseType = '[Exercise] Loaded Exercise Success';
export const loadedExercise = createAction(
  loadedExerciseType,
  props<{ Exercise: ArticleResponse }>()
);
