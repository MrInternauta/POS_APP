import { Id } from './index';
export interface User {
  id: Id;
  email: string;
  role: string;
  customer?: Customer;
}

export interface CreateUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}
export interface Customer {
  name: string;
  lastName: string;
  phone: string;
  id: Id;
}

export interface Auth {
  email: string;
  password: string;
}
