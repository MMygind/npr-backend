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
    const newCustomers: CustomerModel[] = [];
    customers.forEach((customer) => {
      const newCustomer: CustomerModel = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        creationDate: customer.creationDate,
        phoneNumber: customer.phoneNumber,
        subscription: customer.subscription,
        active: customer.active,
      };
      newCustomers.push(newCustomer);
    });
    const customerEntities: CustomerModel[] = JSON.parse(
      JSON.stringify(newCustomers),
    );
    return customerEntities;
  }
}
