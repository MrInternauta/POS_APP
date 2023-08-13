import { createAction, props } from '@ngrx/store';
import { Id, Token } from '../../core/models';
import { User } from '@gymTrack/core';

export const setUser = createAction(
  '[Auth] setUser',
  props<{ user: User; id: Id; token: Token }>()
);

export const unUser = createAction('[Auth] unUser');
