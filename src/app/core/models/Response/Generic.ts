import { User } from '@gymTrack/core';

export interface GenericResponse<T> {
  statusCode: number;
  message?: string | Array<string>;
  error?: string;
  data?: T;
}

export interface UserCreatedResponse {
  message: string;
  user?: User;
}
