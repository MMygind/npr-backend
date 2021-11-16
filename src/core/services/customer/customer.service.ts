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

  async getAllCustomers(): Promise<CustomerModel[]> {
    return await this.customerRepository.find({
      relations: ['subscription', 'licensePlates'],
    });
  }

  async updateCustomer(customer: UpdateCustomerDto) {
    return await this.customerRepository.save(customer);
  }
}
