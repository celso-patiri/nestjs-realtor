import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface DecodedUser {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

export const User = createParamDecorator((_data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
