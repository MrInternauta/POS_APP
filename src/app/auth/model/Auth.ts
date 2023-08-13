import { User } from '@gymTrack/core';

export interface AuthSuccess {
  access_token: string;
  user: User;
}
