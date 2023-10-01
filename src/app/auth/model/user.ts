export interface IUser {
  idusuario: string;
  nombre: string;
  tipo_documento: string;
  num_documento: string;
  telefono: string;
  email: string;
  cargo: string;
  imagen: string;
  login: string;
  direccion: string;
}

export interface Permissions {
  idpermiso?: string;
  nombre?: string;
}
