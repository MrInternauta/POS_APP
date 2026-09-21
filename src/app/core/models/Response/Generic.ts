import { User } from '../usuario.model';

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
