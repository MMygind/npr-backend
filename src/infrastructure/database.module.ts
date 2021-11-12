import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountEntity } from './entities/account.entity';
import { AdministratorEntity } from './entities/administrator.entity';
import { CompanyEntity } from './entities/company.entity';
import { CustomerEntity } from './entities/customer.entity';
import { LicenseplateEntity } from './entities/licenseplate.entity';
import { LocationEntity } from './entities/location.entity';
import { SubscriptionEntity } from './entities/subscription.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { WashTypeEntity } from './entities/washtype.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [
          AccountEntity,
          AdministratorEntity,
          CompanyEntity,
          CustomerEntity,
          LicenseplateEntity,
          LocationEntity,
          SubscriptionEntity,
          TransactionEntity,
          WashTypeEntity,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
