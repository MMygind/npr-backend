import { Injectable, ParseEnumPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../../../infrastructure/entities/customer.entity';
import { Repository } from 'typeorm';
import { CustomerModel } from '../../models/customer.model';
import { SubscriptionModel } from '../../models/subscription.model';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async getAllCustomers(): Promise<CustomerModel[]> {
    const customers = await this.customerRepository.find({
      relations: ['subscription', 'licensePlates'],
    });

    return customers;
  }
}
