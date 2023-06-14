import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService, JwtPayload } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  async use(req: any, res: any, next: () => void): Promise<void> {
    if ('authorization' in req.headers) {
      try {
        const decoded: JwtPayload = this.authService.verify(
          req.headers.authorization.replace('Bearer ', ''),
        );

        if (typeof decoded === 'object' && 'id' in decoded) {
          req['user'] = await this.userService.getById(decoded.id);
        }
      } catch {}
    }
    next();
  }
}
