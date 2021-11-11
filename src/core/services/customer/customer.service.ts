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
      newCustomers.push(this.getCustomer(customer));
    });
    const customerEntities: CustomerModel[] = JSON.parse(
      JSON.stringify(newCustomers),
    );
    return customerEntities;
  }

  /**
   * Takes customer object with passwords properties,
   * and constructs and returns new copy without password properties
   * @param oldCustomer with passwordHash and passwordSalt properties
   * @returns newCustomer a copy without those properties
   */
  getCustomer(oldCustomer: CustomerModel): CustomerModel {
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
