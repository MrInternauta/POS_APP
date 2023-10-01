import { createAction, props } from '@ngrx/store';
import { Id, Token } from '../../core/models';
import { IUser } from '../model/user';

export const setUser = createAction(
  '[Auth] setUser',
  props<{ user: IUser; id: Id; token: Token }>()
);

export const unUser = createAction('[Auth] unUser');


export const loadPermissionsType = '[Auth] loadPermissions Success';
export const loadPermissions = createAction(loadPermissionsType);

export const loadedPermissionsType = '[Auth] Loaded Permissions Success';
export const loadedPermissions = createAction(
  loadedPermissionsType,
  props<{ Permissions: Array<Permissions> }>()
);
