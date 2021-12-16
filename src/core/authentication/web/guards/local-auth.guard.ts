import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
 
@Injectable()
export class WebLocalAuthenticationGuard extends AuthGuard('web-local') {}