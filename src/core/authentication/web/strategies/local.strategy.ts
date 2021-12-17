import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { CompanyEntity } from 'src/infrastructure/entities/company.entity';
import { AuthenticationService } from 'src/core/services/authentication/authentication.service';
 
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