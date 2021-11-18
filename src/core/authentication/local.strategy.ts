import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { CompanyModel } from '../models/company.model';
import { stringify } from 'querystring';
import { CompanyEntity } from 'src/infrastructure/entities/company.entity';
 
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email'
    });
  }
  async validate(email: string, password: string): Promise<CompanyEntity> {
    const company = await this.authenticationService.getAuthenticatedCompany(email, password);
    return company;
  }
}