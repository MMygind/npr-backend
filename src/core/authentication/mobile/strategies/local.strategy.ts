import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { CustomerEntity } from 'src/infrastructure/entities/customer.entity';
import { MobileAuthenticationService } from 'src/core/services/authentication/mobile/authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  'mobile-local'
) {

  constructor(private authenticationService: MobileAuthenticationService) {
    super({
      usernameField: 'email'
    });
  }
  async validate(email: string, password: string): Promise<CustomerEntity> {
    const customer = await this.authenticationService.getAuthenticatedCustomer(email, password);
    return customer;
  }
}