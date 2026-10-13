import { Action, createReducer, createSelector, on } from '@ngrx/store';

import { Id, Token } from '../../core/models/index';
import { StoreSummary } from '../model/store';
import { UserDto } from '../model/user.dto';
import { loadedPermissions, setUser, unUser } from './auth.actions';

export interface IAuthState {
  user: UserDto | null;
  id: Id;
  token: Token;
  permissions: Array<any> | null;
  /** The store being worked in, and every store the user belongs to */
  store?: StoreSummary | null;
  stores?: StoreSummary[];
}

export const initialState: IAuthState = {
  user: null,
  id: null,
  token: null,
  permissions: null,
  store: null,
  stores: [],
};

const _authReducer = createReducer(
  initialState,
  on(setUser, (state, { user, token, id, store, stores }) => ({
    ...state,
    user,
    token,
    id,
    store: store ?? null,
    stores: stores ?? [],
  })),
  on(unUser, state => ({ ...state, user: null, token: null, id: null, store: null, stores: [] })),
  on(loadedPermissions, (state, { Permissions }) => ({
    ...state,
    permissions: Permissions,
  }))
);

export function authReducer(state: any, action: Action) {
  return _authReducer(state, action);
}

export const AuthFeatureKey = 'session_data';

export const selectAuthFeature = (state: { [AuthFeatureKey]: IAuthState }) => state[AuthFeatureKey];

/** What the views read, so an edit of the profile shows up everywhere at once */
export const selectUser = createSelector(selectAuthFeature, (state: IAuthState) => state?.user ?? null);

export const selectStore = createSelector(selectAuthFeature, (state: IAuthState) => state?.store ?? null);

export const selectStores = createSelector(selectAuthFeature, (state: IAuthState) => state?.stores ?? []);

export const selectIsSuperAdmin = createSelector(selectUser, user => !!user?.isSuperAdmin);

/** Runs the store being worked in: its owner, or a super admin in any store */
export const selectCanManage = createSelector(
  selectStore,
  selectIsSuperAdmin,
  (store, superAdmin) => superAdmin || store?.role === 'OWNER'
);
