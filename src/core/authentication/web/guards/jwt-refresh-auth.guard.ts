import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class WebJwtRefreshGuard extends AuthGuard('web-jwt-refresh-token') {}