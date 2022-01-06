import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import TokenPayload from '../token-payload.interface';
import { CustomerService } from 'src/core/services/customer/customer.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'mobile-jwt'
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly customerService: CustomerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authentication;
      }]),
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  async validate(payload: TokenPayload) {
    return this.customerService.getById(payload.userId);
  }
}