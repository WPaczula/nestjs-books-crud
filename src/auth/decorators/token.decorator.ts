import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers['authorization'] as string;
    const token = authHeader && authHeader.split(' ')[1];

    return token;
  },
);
