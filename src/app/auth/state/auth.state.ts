import { Action, createReducer, on } from '@ngrx/store';

import { setUser, unUser } from './auth.actions';
import { Id, Token, User } from '../../core/models/index';

export interface IAuthState {
  user: User | null;
  id: Id;
  token: Token;
}

export const initialState: IAuthState = {
  user: null,
  id: null,
  token: null,
};

const _authReducer = createReducer(
  initialState,
  on(setUser, (state, { user, token, id }) => ({ ...state, user, token, id })),
  on(unUser, (state) => ({ ...state, user: null, token: null, id: null }))
);

export function authReducer(state: any, action: Action) {
  return _authReducer(state, action);
}
