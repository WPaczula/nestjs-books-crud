import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ITokenUser } from '../interfaces/tokenUser.interface';

export const TokenUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<{ user?: ITokenUser }>();
    return req.user;
  },
);
