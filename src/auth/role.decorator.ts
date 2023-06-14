import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';

export type AllowType = keyof typeof UserRole;
export const Role = (roles: AllowType[]) => SetMetadata('roles', roles);
