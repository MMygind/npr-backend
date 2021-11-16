import { Injectable, ParseEnumPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../../../infrastructure/entities/customer.entity';
import { Repository } from 'typeorm';
import { CustomerModel } from '../../models/customer.model';
import { UpdateCustomerDto } from '../../dtos/updateCustomer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async updateCustomer(customer: UpdateCustomerDto) {
    return await this.customerRepository.save(customer);
  }

  async getAllFilteredCustomers(
    status: boolean,
    subscription: string,
  ): Promise<CustomerModel[]> {
    let customerList;

    if (status != null && subscription != null) {
      const filteredList = this.customerRepository
        .createQueryBuilder('customer')
        .leftJoinAndSelect('customer.subscription', 'subscription')
        .where('customer.active = :status', { status })
        .andWhere('subscription.name = :subscription', {
          subscription,
        })
        .execute();

      customerList = filteredList;
    }
    else if (status != null && subscription == null) {
      const filteredList = this.customerRepository
        .createQueryBuilder('customer')
        .where('customer.active = :status', { status })
        .execute();

      customerList = filteredList;
    }
    else if (subscription != null && status == null) {
      const filteredList = this.customerRepository
        .createQueryBuilder('customer')
        .leftJoinAndSelect('customer.subscription', 'subscription')
        .where('subscription.name = :subscription', {
          subscription,
        })
        .execute();

      customerList = filteredList;
    }
    else {
      const list = this.customerRepository.find({
        relations: ['subscription', 'licensePlates'],
      });

      customerList = list;
    }

    return customerList;
  }
}
