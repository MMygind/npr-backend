import { HttpException, HttpStatus, Injectable, ParseEnumPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../../../infrastructure/entities/customer.entity';
import { Brackets, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CustomerModel } from '../../models/customer.model';
import { UpdateCustomerDto } from '../../../api/_web/dtos/update-customer.dto';
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";
import { CreateCustomerDto } from 'src/api/_mobile/dtos/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async getById(id: number) {
    const customer = await this.customerRepository.findOne({ id });
    if (customer) {
      return customer;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }


  async getByEmail(email: string) {
    const customer = await this.customerRepository.findOne({ email });
    if (customer) {
      return customer;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

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

  async create(customerData: CreateCustomerDto) {
    const newCustomer = await this.customerRepository.create(customerData);
    await this.customerRepository.save(newCustomer);
    return newCustomer;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.customerRepository.update(userId, {
      currentHashedRefreshToken
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);
 
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
 
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.customerRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }
}
