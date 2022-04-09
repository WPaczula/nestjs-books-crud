import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const Authenticated = () => UseGuards(AuthGuard('jwt'));
