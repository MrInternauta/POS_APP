import { UserDto } from '@gymTrack/auth/model/user.dto';

export interface UserUpdatedResponse {
  message: string;
  user: UserDto;
}
