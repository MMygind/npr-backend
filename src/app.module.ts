import { Module } from '@nestjs/common';
import { CompanyModule } from './api/_web/controllers/company.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './infrastructure/database.module';
import { TransactionModule } from './api/_web/controllers/transaction.module';
import { AdministratorModule } from './api/_web/controllers/administrator.module';
import { LocationModule } from "./api/_web/controllers/location.module";
import { WashTypeModule } from "./api/_web/controllers/washtype.module";
import { AuthenticationModule } from './api/_web/controllers/authentication.module';
import { CustomerModule } from './api/_web/controllers/customer.module';
import { MobileCustomerModule } from './api/_mobile/controllers/mobile-customer.module';
import { MobileAuthenticationModule } from './api/_mobile/controllers/mobile-authentication.module';
import { LicensePlateModule } from './api/licenseplate.module';
import { SubscriptionModule } from './api/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),

        // Authentication
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    CustomerModule,
    AuthenticationModule,
    TransactionModule,
    CompanyModule,
    AdministratorModule,
    LocationModule,
    WashTypeModule,
    MobileCustomerModule,
    MobileAuthenticationModule,
    LicensePlateModule,
    SubscriptionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
