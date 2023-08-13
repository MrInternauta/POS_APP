import { ActionReducerMap } from '@ngrx/store';

import * as auth from '../../auth/state/auth.state';
import * as exercise from '../../pages/workout/state/workout.state';

export interface AppState {
  session_data: auth.IAuthState;
  exercises: exercise.ExerciseState;
}

export const appReducers: ActionReducerMap<AppState> = {
  session_data: auth.authReducer,
  exercises: exercise.ExerciseReducer,
};
