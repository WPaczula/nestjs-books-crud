import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ACCESS_TOKEN_STRAGETY_NAME,
  REFRESH_TOKEN_STRATEGY_NAME,
} from '../strategies';

export const UseAuthenticationToken = () =>
  UseGuards(AuthGuard(ACCESS_TOKEN_STRAGETY_NAME));

export const UseRefreshToken = () =>
  UseGuards(AuthGuard(REFRESH_TOKEN_STRATEGY_NAME));
