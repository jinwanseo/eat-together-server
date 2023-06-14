import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export type JwtPayload = {
  id: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  sign(payload: object): string {
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
    });
  }

  verify(token: string): JwtPayload {
    return this.jwtService.verify(token, {
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
