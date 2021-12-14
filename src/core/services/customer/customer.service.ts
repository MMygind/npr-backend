import { Injectable, ParseEnumPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../../../infrastructure/entities/customer.entity';
import { Brackets, Repository } from 'typeorm';
import { CustomerModel } from '../../models/customer.model';
import { UpdateCustomerDto } from '../../dtos/updateCustomer.dto';
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";

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
    options: IPaginationOptions,
    queryValue: string,
    active: boolean,
    subscription: string,
  ): Promise<Pagination<CustomerModel>> {
    const query = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.subscription', 'subscription')
      .leftJoinAndSelect('customer.licensePlates', 'licensePlates')
      .orderBy('customer.name', 'ASC');

    if (active != null && subscription != null) {
      query
        .where('customer.active = :active', { active })
        .andWhere('subscription.name = :subscription', {
          subscription,
        });
    } else if (active != null && subscription == null) {
      query.where('customer.active = :active', { active });
    } else if (subscription != null && active == null) {
      query.where('subscription.name = :subscription', {
        subscription,
      });
    }

    if (queryValue) {
      if (active != null || subscription != null) {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('LOWER(customer.name) LIKE :name', {
              name: `%${queryValue}%`,
            })
              .orWhere('LOWER(customer.email) LIKE :email', {
                email: `%${queryValue}%`,
              })
              .orWhere('LOWER(customer.phoneNumber) LIKE :phoneNumber', {
                phoneNumber: `%${queryValue}%`,
              });
          }),
        );
      } else {
        query.where(
          new Brackets((qb) => {
            qb.where('LOWER(customer.name) LIKE :name', {
              name: `%${queryValue}%`,
            })
              .orWhere('LOWER(customer.email) LIKE :email', {
                email: `%${queryValue}%`,
              })
              .orWhere('LOWER(customer.phoneNumber) LIKE :phoneNumber', {
                phoneNumber: `%${queryValue}%`,
              });
          }),
        );
      }
    }

    return await paginate<CustomerModel>(query, options);
  }
}
