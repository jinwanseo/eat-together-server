import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request?.user;
  },
);
export default AuthUser;
