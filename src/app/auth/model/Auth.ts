import { StoreSummary } from './store';
import { UserDto } from './user.dto';

/** What logging in, switching store and creating a store answer */
export interface AuthSuccess {
  access_token: string;
  user: UserDto;
  /** The store the token works in; null for someone who has none yet */
  store: StoreSummary | null;
  stores: StoreSummary[];
}
