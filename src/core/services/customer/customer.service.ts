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
    active: boolean,
    subscription: string,
  ): Promise<CustomerModel[]> {
    const query = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.subscription', 'subscription')
      .leftJoinAndSelect('customer.licensePlates', 'licensePlates');

    if (active != null && subscription != null) {
      query
        .where('customer.active = :active', { active })
        .andWhere('subscription.name = :subscription', {
          subscription,
        });
    }
    else if (active != null && subscription == null) {
      query.where('customer.active = :active', { active });
    }
    else if (subscription != null && active == null) {
      query.where('subscription.name = :subscription', {
        subscription,
      });
    }

    return await query.getMany();
  }
}
