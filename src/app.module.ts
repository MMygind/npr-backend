import { Module } from '@nestjs/common';
import { CompanyModule } from './api/company.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './infrastructure/database.module';
import { CustomerModule } from './api/customer.module';
import { TransactionModule } from './api/transaction.module';
import { AdministratorModule } from './api/administrator.module';
import { LocationModule } from "./api/location.module";
import { WashTypeModule } from "./api/washtype.module";
import { LicensePlateModule } from './api/licenseplate.module';

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
      }),
    }),
    DatabaseModule,
    CustomerModule,
    TransactionModule,
    CompanyModule,
    AdministratorModule,
    LocationModule,
    WashTypeModule,
    LicensePlateModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
