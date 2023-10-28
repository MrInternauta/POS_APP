import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, take } from 'rxjs/operators';
import { AuthService } from '../services';
import { loadPermissionsType, loadedPermissionsType } from './auth.actions';

@Injectable()
export class PermissionsEffects {
  loadExercises$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPermissionsType),
      mergeMap(() =>
        this.authService
          .getPerssions(this.authService.user?.id?.toString() || '')
          .pipe(
            map((response) => ({
              type: loadedPermissionsType,
              Permissions: response,
            })),
            catchError((e) => {
              console.log(e);
              return EMPTY;
            })
          )
      )
    )
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
