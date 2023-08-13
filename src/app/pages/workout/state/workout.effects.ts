import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, take } from 'rxjs/operators';
import { WorkoutService } from '../services/workout.service';
import { loadExerciseType, loadedExerciseType } from './workout.actions';

@Injectable()
export class ExercisesEffects {
  loadExercises$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExerciseType),
      mergeMap(() =>
        this.exercisesService.getExercises().pipe(
          map((Exercises) => ({
            type: loadedExerciseType,
            payload: Exercises,
          })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private exercisesService: WorkoutService
  ) {}
}
