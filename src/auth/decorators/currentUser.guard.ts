import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTPayload } from '../interfaces/jwtPayload.interface';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<{ user?: JWTPayload }>();
    return req.user;
  },
);
