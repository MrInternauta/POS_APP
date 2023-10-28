import { UserDto } from './user.dto';

export interface AuthSuccess {
  access_token: string;
  user: UserDto;
}
