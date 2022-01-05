import {
  HttpException,
  HttpStatus,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../../../infrastructure/entities/customer.entity';
import { Brackets, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CustomerModel } from '../../models/customer.model';
import { UpdateCustomerDto } from '../../../api/dtos/update-customer.dto';
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";
import { CreateCustomerDto } from 'src/api/dtos/create-customer.dto';
import { CompanyService } from "../company/company.service";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>
  ) { }

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

  async getCustomer(customerID: number): Promise<CustomerModel> {
    if (customerID <= 0) {
      throw new BadRequestException('Customer ID must be a positive integer');
    }
    const customer = await this.customerRepository.findOne(customerID, {
      relations: ['company', 'licensePlates'],
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerID} not found`);
    }
    return customer;
  }

  async updateCustomer(customer: UpdateCustomerDto) {
    return await this.customerRepository.save(customer);
  }

  async getAllFilteredCustomers(
    options: IPaginationOptions,
    queryValue: string,
    active: boolean,
    subscription: string,
    id: number,
  ): Promise<Pagination<CustomerModel>> {
    const query = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.subscription', 'subscription')
      .leftJoinAndSelect('customer.licensePlates', 'licensePlates')
      .orderBy('customer.name', 'ASC');

    query.where('customer.company.id = :id', {id})

    if (active != null && subscription != null) {
      query
        .andWhere('customer.active = :active', { active })
        .andWhere('subscription.name = :subscription', {
          subscription,
        });
    } else if (active != null && subscription == null) {
      query.andWhere('customer.active = :active', { active });
    } else if (subscription != null && active == null) {
      query.andWhere('subscription.name = :subscription', {
        subscription,
      });
    }

    if (queryValue) {
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

  async getCustomerById(id: number): Promise<CustomerModel> {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    const customer = await this.customerRepository.findOne(id, {
      relations: ['subscription', 'licensePlates'],
      withDeleted: true,
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }
}
