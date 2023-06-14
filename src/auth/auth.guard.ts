import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AllowType } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const roles = this.reflector.get<AllowType>('roles', context.getHandler());
    if (!roles) return true;
    if ('user' in request) {
      if (roles.includes('Client')) return true;
      return roles.includes(request.user.role);
    }
    return false;
  }
}
