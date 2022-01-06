import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CompanyService } from 'src/core/services/company/company.service';
import TokenPayload from '../token-payload.interface';
 
@Injectable()
@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'web-jwt'
) {  constructor(
    private readonly configService: ConfigService,
    private readonly companyService: CompanyService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authentication;
      }]),
      secretOrKey: configService.get('JWT_SECRET')
    });
  }
 
  async validate(payload: TokenPayload) {
    return this.companyService.getById(payload.userId);
  }
}