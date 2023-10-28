import { Action, createReducer, on } from '@ngrx/store';

import { loadedPermissions, setUser, unUser } from './auth.actions';
import { Id, Token } from '../../core/models/index';
import { UserDto } from '../model/user.dto';

export interface IAuthState {
  user: UserDto | null;
  id: Id;
  token: Token;
  permissions: Array<any> | null;
}

export const initialState: IAuthState = {
  user: null,
  id: null,
  token: null,
  permissions: null,
};

const _authReducer = createReducer(
  initialState,
  on(setUser, (state, { user, token, id }) => ({ ...state, user, token, id })),
  on(unUser, (state) => ({ ...state, user: null, token: null, id: null })),
  on(loadedPermissions, (state, { Permissions }) => ({
    ...state,
    permissions: Permissions,
  }))
);

export function authReducer(state: any, action: Action) {
  return _authReducer(state, action);
}
