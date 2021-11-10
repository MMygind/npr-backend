import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './infrastructure/database.module';
import { CustomerModule } from './api/customer.module';
import { TransactionModule } from './api/transaction.module';

@Module({
  imports: [
    CompanyModule,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
