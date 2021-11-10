import { Module } from '@nestjs/common';
import { CustomersController } from './controllers/customers/customers.controller';
import { CustomerService } from '../core/services/customer/customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '../infrastructure/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomersController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
