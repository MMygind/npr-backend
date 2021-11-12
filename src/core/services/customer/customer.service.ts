import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../../../infrastructure/entities/customer.entity';
import { Repository } from 'typeorm';
import { CustomerModel } from '../../models/customer.model';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async getAllCustomers(): Promise<CustomerModel[]> {
    const customers = await this.customerRepository.find({
      relations: ['subscription'],
    });
    return customers;
  }
}
