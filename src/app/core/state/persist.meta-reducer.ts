import { ActionReducer, INIT, UPDATE } from '@ngrx/store';

import { StorageService } from '../services/storage.service';
import { AppState } from './app.reducer';

/**
 * Slices written to local storage. The products list is left out on purpose: it is server data
 * that is paged in again on every start.
 */
const PERSISTED_SLICES = ['cart'] as const;

export const PERSISTED_STATE_KEY = 'app_state';

type PersistedSlice = (typeof PERSISTED_SLICES)[number];
type PersistedState = Partial<Pick<AppState, PersistedSlice>>;

function pickPersisted(state: AppState): PersistedState {
  return PERSISTED_SLICES.reduce((persisted: PersistedState, slice) => {
    persisted[slice] = state?.[slice];
    return persisted;
  }, {});
}

/** Two states share the same persisted content while every slice is the very same object */
function samePersistedState(a: PersistedState | null, b: PersistedState) {
  return a != null && PERSISTED_SLICES.every(slice => a[slice] === b[slice]);
}

export function persistStateMetaReducer(storage: StorageService) {
  //The last written content, so an action that does not touch the cart writes nothing
  let lastPersisted: PersistedState | null = null;

  return (reducer: ActionReducer<AppState>): ActionReducer<AppState> =>
    (state, action) => {
      //The store replays INIT and UPDATE with no state, the moment to hand back what was saved
      if (action.type === INIT || action.type === UPDATE) {
        const saved: PersistedState | null = storage.getLocal(PERSISTED_STATE_KEY);
        if (saved) {
          lastPersisted = saved;
          return reducer({ ...(state as AppState), ...saved }, action);
        }
      }

      const nextState = reducer(state, action);
      const toPersist = pickPersisted(nextState);

      if (!samePersistedState(lastPersisted, toPersist)) {
        lastPersisted = toPersist;
        storage.setLocal(PERSISTED_STATE_KEY, toPersist);
      }

      return nextState;
    };
}
