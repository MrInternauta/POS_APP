

export interface RoleDto {
  name: string;

  permissions: PermissionDto[];
}

export interface PermissionDto {
  id?: number;

  name: string;

  description: string;
}
