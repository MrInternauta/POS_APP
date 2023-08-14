import { createAction, props } from '@ngrx/store';
import { Id, Token } from '../../core/models';
import { IUser } from '../model/user';

export const setUser = createAction(
  '[Auth] setUser',
  props<{ user: IUser; id: Id; token: Token }>()
);

export const unUser = createAction('[Auth] unUser');
