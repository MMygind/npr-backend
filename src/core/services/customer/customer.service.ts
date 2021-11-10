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
      newCustomers.push(this.getCustomerWithoutPassword(customer));
    });
    const customerEntities: CustomerModel[] = JSON.parse(
      JSON.stringify(newCustomers),
    );
    return customerEntities;
  }

  getCustomerWithoutPassword(oldCustomer: CustomerModel): CustomerModel {
    const newCustomer: CustomerModel = {
      id: oldCustomer.id,
      name: oldCustomer.name,
      email: oldCustomer.email,
      creationDate: oldCustomer.creationDate,
      phoneNumber: oldCustomer.phoneNumber,
      subscription: oldCustomer.subscription,
      active: oldCustomer.active,
    };
    return newCustomer;
  }
}
