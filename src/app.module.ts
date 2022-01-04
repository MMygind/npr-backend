import { Module } from '@nestjs/common';
import { CompanyModule } from './api/_web/controllers/company.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './infrastructure/database.module';
import { TransactionModule } from './api/_web/controllers/transaction.module';
import { LocationModule } from "./api/_web/controllers/location.module";
import { WashTypeModule } from "./api/_web/controllers/washtype.module";
import { AuthenticationModule } from './api/_web/controllers/authentication.module';
import { CustomerModule } from './api/_web/controllers/customer.module';
import { MobileCustomerModule } from './api/_mobile/controllers/mobile-customer.module';
import { MobileAuthenticationModule } from './api/_mobile/controllers/mobile-authentication.module';
import {
  MobileLicensePlateModule,
} from './api/_mobile/controllers/mobile-licenseplate.module';
import { MobileSubscriptionModule } from './api/_mobile/controllers/mobile-subscription.module';
import { MobileLocationModule } from './api/_mobile/controllers/mobile-location.module';
import { MobileTransactionModule } from './api/_mobile/controllers/mobile-transaction.module';
import { MobileWashTypeModule } from './api/_mobile/controllers/mobile-washtype.module';
import { IotModule } from './api/_iot/iot.module';

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
    LocationModule,
    WashTypeModule,
    MobileCustomerModule,
    MobileAuthenticationModule,
    MobileLicensePlateModule,
    MobileSubscriptionModule,
    MobileLocationModule,
    MobileTransactionModule,
    MobileWashTypeModule,
    IotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
